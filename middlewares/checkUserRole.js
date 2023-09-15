const mongoose = require('mongoose');
const User = require('../models/user'); 

function checkUserRole(requiredRole) {
  return async (req, res, next) => {
    const userId = req.user.id;
    try {
      const user = await User.findById(userId);

      if (user && user.AccountType === requiredRole) {
        next();
      } 
      else {
        res.status(403).send({ message: "Access forbidden" });
      }
    } 
    catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = {
  checkUserRole,
};
