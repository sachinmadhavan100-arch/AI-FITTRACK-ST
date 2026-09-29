const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  addWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  searchWorkouts
} = require("../controllers/workoutController");

const router = express.Router();

router.use(protect);

router.post("/", addWorkout);
router.get("/search", searchWorkouts);
router.get("/", getAllWorkouts);
router.get("/:id", getWorkoutById);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

module.exports = router;
