const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  workoutRecommendation,
  fitnessInsights
} = require("../controllers/aiController");

const router = express.Router();

router.use(protect);

router.post("/recommendation", workoutRecommendation);
router.post("/insights", fitnessInsights);

module.exports = router;
