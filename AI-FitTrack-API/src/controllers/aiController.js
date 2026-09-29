const Workout = require("../models/Workout");
const {
  generateRecommendation,
  generateInsights
} = require("../services/geminiService");

async function workoutRecommendation(req, res, next) {
  try {
    const { age, fitnessGoal, experienceLevel } = req.body;

    if (!age || !fitnessGoal || !experienceLevel) {
      return res.status(400).json({
        success: false,
        message: "Age, fitnessGoal and experienceLevel are required"
      });
    }

    const result = await generateRecommendation({
      age,
      fitnessGoal,
      experienceLevel
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function fitnessInsights(req, res, next) {
  try {
    const workouts = await Workout.find({ user: req.user.id });

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum, workout) => sum + workout.duration,
      0
    );
    const totalCalories = workouts.reduce(
      (sum, workout) => sum + workout.caloriesBurned,
      0
    );
    const averageDuration =
      totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    const result = await generateInsights({
      totalWorkouts,
      averageDuration,
      totalCalories
    });

    res.json({
      success: true,
      statistics: {
        totalWorkouts,
        averageDuration,
        totalCalories
      },
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { workoutRecommendation, fitnessInsights };
