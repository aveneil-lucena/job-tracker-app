const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user id to request object
    req.user = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
