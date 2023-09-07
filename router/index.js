const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Backend working fine.....",
  });
});
router.use("/user", require("./userRoutes"));
module.exports = router;
