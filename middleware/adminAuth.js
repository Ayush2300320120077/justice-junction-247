import jwt from 'jsonwebtoken';

export function verifyAdminToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No admin token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ADMIN_SECRET || 'jj_god_mode_secret');
    if (payload.type !== 'admin') {
      throw new Error('Invalid token type');
    }
    return payload;
  } catch (error) {
    throw new Error('Unauthorized');
  }
}

export function withAdminAuth(handler) {
  return async (req, res) => {
    try {
      req.admin = verifyAdminToken(req);
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin token' });
    }
  };
}
