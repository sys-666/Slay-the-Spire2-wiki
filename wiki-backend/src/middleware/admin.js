const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: '权限不足，需要管理员权限' });
  }
  next();
};

module.exports = admin;
