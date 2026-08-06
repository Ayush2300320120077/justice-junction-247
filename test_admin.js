

const BASE_URL = 'http://localhost:5000/api';
let cookieHeaderAdmin = '';
let cookieHeaderClient = '';
let cookieHeaderLawyer = '';

let adminId, clientId, lawyerId;
let lawyerDocId;
let bookingId1, bookingId2;

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  
  let cookies = res.headers.getSetCookie();
  if (cookies) {
    if (path.includes('admin/login')) {
      cookieHeaderAdmin = cookies.map(c => c.split(';')[0]).join('; ');
    } else if (path.includes('register') && options.body.includes('client')) {
      cookieHeaderClient = cookies.map(c => c.split(';')[0]).join('; ');
    } else if (path.includes('register') && options.body.includes('lawyer')) {
      cookieHeaderLawyer = cookies.map(c => c.split(';')[0]).join('; ');
    } else if (path.includes('/auth/login') && options.body.includes('client')) {
      cookieHeaderClient = cookies.map(c => c.split(';')[0]).join('; ');
    }
  }
  
  const bodyText = await res.text();
  try {
    const data = JSON.parse(bodyText);
    return { status: res.status, ok: res.ok, data };
  } catch(e) {
    return { status: res.status, ok: res.ok, data: bodyText };
  }
}

async function runTests() {
  console.log("=== STARTING VERIFICATION ===\n");

  const ts = Date.now();
  const adminEmail = `admin_${ts}@test.com`;
  const clientEmail = `client_${ts}@test.com`;
  const lawyerEmail = `lawyer_${ts}@test.com`;

  // 1. Create a client and lawyer
  console.log("1. Registering test client and lawyer...");
  let res = await request('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Test Client', email: clientEmail, password: 'password', role: 'client' }) });
  clientId = res.data.user?.id;
  
  res = await request('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Test Lawyer', email: lawyerEmail, password: 'password', role: 'lawyer', city: 'Delhi', state: 'Delhi', barRegistrationNumber: `D/${ts}` }) });
  lawyerId = res.data.user?.id;
  
  // Create an admin by registering a client and then manually updating the DB via Mongoose
  res = await request('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Test Admin', email: adminEmail, password: 'password', role: 'client' }) });
  
  require('dotenv').config();
  const mongoose = require('mongoose');
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.db.collection('users').updateOne({ email: adminEmail }, { $set: { role: 'admin' } });
  
  // Login as admin
  res = await request('/admin/login', { method: 'POST', body: JSON.stringify({ email: adminEmail, password: 'password' }) });
  if (!res.ok) { console.error("Admin login failed", res.data); return; }
  console.log("Admin login successful.");

  // Login as client
  res = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: clientEmail, password: 'password' }) });
  if (!res.ok) { console.error("Client login failed", res.data); return; }
  console.log("Client login successful.");

  console.log("\n=== VERIFY 3: Auth on new admin endpoints ===");
  // Test as client
  const endpoints = ['/admin/lawyers', '/admin/clients', '/admin/bookings'];
  for (let ep of endpoints) {
    res = await request(ep, { headers: { Cookie: cookieHeaderClient } });
    if (res.status === 403) {
      console.log(`[PASS] GET ${ep} as client returned 403 Forbidden.`);
    } else {
      console.log(`[FAIL] GET ${ep} as client returned ${res.status}. Expected 403.`);
    }
  }
  
  // Verify PUT /bookings/:id/status as client
  // Wait, I need a valid booking ID first. I'll test it after creating one.
  
  console.log("\n=== VERIFY 1: End-to-end functional test ===");
  
  // As Admin, GET lawyers and verify our test lawyer is there
  res = await request('/admin/lawyers', { headers: { Cookie: cookieHeaderAdmin } });
  let lawyers = res.data.data;
  let foundLawyer = lawyers.find(l => l.email === lawyerEmail);
  if (foundLawyer) {
    lawyerDocId = foundLawyer._id;
    console.log("[PASS] Admin GET /admin/lawyers found the new lawyer.");
    // Approve the lawyer so they can be booked
    await mongoose.connection.db.collection('lawyers').updateOne({ _id: foundLawyer._id }, { $set: { isVerified: true, isAvailable: true, consultationFee: 1000 } });
  } else {
    console.log("[FAIL] Admin GET /admin/lawyers did not find the new lawyer.");
    console.log(res.data);
  }

  // As Admin, GET clients and verify our test client is there
  res = await request('/admin/clients', { headers: { Cookie: cookieHeaderAdmin } });
  let clients = res.data.data;
  let foundClient = clients.find(c => c.email === clientEmail);
  if (foundClient) {
    console.log("[PASS] Admin GET /admin/clients found the new client.");
  } else {
    console.log("[FAIL] Admin GET /admin/clients did not find the new client.");
  }
  
  // As Client, create two bookings with the test lawyer
  console.log("\nAs Client, booking the test lawyer...");
  res = await request('/bookings', { 
    method: 'POST', 
    headers: { Cookie: cookieHeaderClient },
    body: JSON.stringify({ lawyerId: lawyerDocId, caseType: 'Family Law', scheduledDate: '2026-09-01', scheduledTime: '10:00 AM' })
  });
  if (res.ok) {
    bookingId1 = res.data.booking._id;
    console.log(`[PASS] Client created Booking 1 successfully (${bookingId1}).`);
  } else {
    console.log("[FAIL] Client failed to create Booking 1.", res.data);
  }
  
  res = await request('/bookings', { 
    method: 'POST', 
    headers: { Cookie: cookieHeaderClient },
    body: JSON.stringify({ lawyerId: lawyerDocId, caseType: 'Criminal Defence', scheduledDate: '2026-09-02', scheduledTime: '11:00 AM' })
  });
  bookingId2 = res.data.booking?._id;
  
  // Test PUT /bookings/:id/status as client
  res = await request(`/bookings/${bookingId1}/status`, {
    method: 'PUT',
    headers: { Cookie: cookieHeaderClient },
    body: JSON.stringify({ status: 'confirmed' })
  });
  if (res.status === 403) {
    console.log(`[PASS] PUT /bookings/:id/status as client to 'confirmed' returned 403 Forbidden.`);
  } else {
    console.log(`[FAIL] PUT /bookings/:id/status as client returned ${res.status}. Expected 403.`);
  }

  // Admin approves Booking 1
  res = await request(`/admin/bookings/${bookingId1}/status`, {
    method: 'PATCH',
    headers: { Cookie: cookieHeaderAdmin },
    body: JSON.stringify({ status: 'confirmed' })
  });
  if (res.ok && res.data.data.status === 'confirmed') {
    console.log("[PASS] Admin successfully approved Booking 1 (confirmed).");
  } else {
    console.log("[FAIL] Admin failed to approve Booking 1.", res.data);
  }

  // Admin rejects Booking 2
  res = await request(`/admin/bookings/${bookingId2}/status`, {
    method: 'PATCH',
    headers: { Cookie: cookieHeaderAdmin },
    body: JSON.stringify({ status: 'cancelled' })
  });
  if (res.ok && res.data.data.status === 'cancelled') {
    console.log("[PASS] Admin successfully rejected Booking 2 (cancelled).");
  } else {
    console.log("[FAIL] Admin failed to reject Booking 2.", res.data);
  }

  console.log("\n=== TESTS COMPLETE ===");
  process.exit(0);
}

runTests();
