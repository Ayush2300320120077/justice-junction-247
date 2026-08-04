const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Lawyer = require('./models/Lawyer');

const baseUrl = 'http://localhost:5000';

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => null);
    const setCookie = res.headers.get('set-cookie');
    let cookieToken = null;
    if (setCookie) {
      const match = setCookie.match(/accessToken=([^;]+)/);
      if (match) cookieToken = match[1];
    }
    return { status: res.status, data, cookieToken };
  } catch(e) {
    return { status: 'ERROR', data: e.message };
  }
}

async function runTests() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://121ayushkumar121_db_user:Ash%40%40924653@cluster0.hbrbu66.mongodb.net/justicejunction?retryWrites=true&w=majority&appName=Cluster0');
  
  // Ensure we have a test admin
  const adminEmail = 'testadmin_automation@example.com';
  const adminPass = 'admin123';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Test Admin', email: adminEmail, password: adminPass, role: 'admin'
    });
  } else {
    admin.password = adminPass;
    await admin.save();
  }

  // Ensure we have a test lawyer
  const lawyerEmail = `lawyer${Date.now()}@example.com`;
  const lawyerUser = await User.create({
    name: 'Test Lawyer', email: lawyerEmail, password: 'password123', role: 'lawyer'
  });
  const testLawyer = await Lawyer.create({
    user: lawyerUser._id, name: 'Test Lawyer', email: lawyerEmail, isVerified: false, verificationStatus: 'pending',
    consultationFee: 100, state: 'Delhi', city: 'Delhi', experience: 5, barRegistrationNumber: `BAR/${Date.now()}`
  });


  console.log("=== END-TO-END VERIFICATION ===");
  const email = `testuser${Date.now()}@example.com`;
  const password = "password123";

  console.log("\n1. REGISTRATION");
  let res = await req('POST', '/api/auth/register', { name: "Test User", email, password, role: "client" });
  console.log(`[POST /register valid] Expect 201/200: ${res.status}. Role in DB: ${res.data?.user?.role}`);

  res = await req('POST', '/api/auth/register', { name: "Test User", email, password, role: "client" });
  console.log(`[POST /register duplicate] Expect 400: ${res.status}. Body: ${JSON.stringify(res.data)}`);

  const emailAdmin = `testadmin${Date.now()}@example.com`;
  res = await req('POST', '/api/auth/register', { name: "Test Admin", email: emailAdmin, password, role: "admin" });
  console.log(`[POST /register mass-assignment] Expect client role: ${res.data?.user?.role}`);

  res = await req('POST', '/api/auth/register', { name: "Test", email: "bademail", password, role: "client" });
  console.log(`[POST /register malformed email] Expect 400 validation: ${res.status}. Body: ${JSON.stringify(res.data)}`);


  console.log("\n2. LOGIN (regular user)");
  res = await req('POST', '/api/auth/login', { email, password });
  console.log(`[POST /login correct] Expect 200: ${res.status}. Token in JSON: ${!!res.data?.token}`);
  const clientToken = res.data?.token;

  for (let i = 1; i <= 6; i++) {
    const wrongRes = await req('POST', '/api/auth/login', { email, password: "wrongpassword" });
    if (i === 6) {
      console.log(`[POST /login lockout 6th attempt] Expect lockout (403): ${wrongRes.status}. Body: ${JSON.stringify(wrongRes.data)}`);
    }
  }


  console.log("\n3. ADMIN LOGIN");
  res = await req('POST', '/api/admin/login', { email: adminEmail, password: adminPass });
  console.log(`[POST /admin/login correct] Expect 200: ${res.status}. Token in JSON: ${!!res.data?.token}. Token in Cookie: ${!!res.cookieToken}`);
  const adminToken = res.cookieToken || res.data?.token;

  res = await req('POST', '/api/admin/login', { email, password });
  console.log(`[POST /admin/login non-admin] Expect 401: ${res.status}. Body: ${JSON.stringify(res.data)}`);


  console.log("\n4. ADMIN LAWYER APPROVAL -> PUBLIC SEARCH");
  res = await req('GET', '/api/lawyers?sort=newest&limit=100');
  console.log(`[GET /lawyers before verify] Found lawyer: ${res.data?.lawyers?.some(l => l.email === lawyerEmail) || false}`);

  res = await req('PATCH', `/api/admin/lawyers/${testLawyer._id}/verify`, { approved: true }, adminToken);
  console.log(`[PATCH /admin/lawyers/:id/verify] Expect 200: ${res.status}`);

  res = await req('GET', '/api/lawyers?sort=newest&limit=100');
  console.log(`[GET /lawyers after verify] Found lawyer: ${res.data?.lawyers?.some(l => l.email === lawyerEmail) || false}`);


  console.log("\n5. ADMIN ROUTE PROTECTION");
  res = await req('GET', '/api/admin/users', null, null);
  console.log(`[GET /admin/users NO token] Expect 401: ${res.status}`);
  
  res = await req('GET', '/api/admin/users', null, clientToken);
  console.log(`[GET /admin/users CLIENT token] Expect 403: ${res.status}`);

  res = await req('GET', '/api/admin/users', null, adminToken);
  console.log(`[GET /admin/users ADMIN token] Expect 200: ${res.status}`);


  console.log("\n6. INJECTION / VALIDATION SANITY CHECK");
  res = await req('POST', '/api/auth/login', { email: { "$ne": null }, password: { "$ne": null } });
  console.log(`[POST /login NoSQL injection] Expect 400 validation or sanitized block: ${res.status}. Body: ${JSON.stringify(res.data)}`);


  console.log("\n7. HEALTH CHECK");
  res = await req('GET', '/api/health');
  console.log(`[GET /api/health] Expect 200: ${res.status}. Body: ${JSON.stringify(res.data)}`);

  console.log("\nDone!");
  process.exit(0);
}

runTests().catch(console.error);
