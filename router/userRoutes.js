const { Router } = require("express");
const router = Router();
const {
  userSignup,
  userLogin,
  userUpdate,
  userDelete,
  userCurrent,
} = require("../controller/userControl");
const { verifyToken } = require("../config/authVerify");

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/current-user", verifyToken, userCurrent);
router.put("/update/:userId", verifyToken, userUpdate);
router.delete("/delete/:userId", verifyToken, userDelete);

module.exports = router;
