const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);
  // Check if header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  // Extract token string after 'Bearer '
  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    // Attach user id (or payload) to request object for later use
    req.user = decoded.id;
    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    // Token verification failed
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
