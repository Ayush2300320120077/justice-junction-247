const jwt = require('jsonwebtoken');

function verifyAdminToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No admin token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      throw new Error('Insufficient permissions');
    }
    return decoded;
  } catch (error) {
    throw new Error('Unauthorized');
  }
}

function adminRequired(req, res, next) {
  try {
    req.admin = verifyAdminToken(req);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Admin access required' });
  }
}

module.exports = { verifyAdminToken, adminRequired };
