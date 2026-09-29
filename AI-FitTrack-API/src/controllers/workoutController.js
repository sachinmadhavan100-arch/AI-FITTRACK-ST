const Workout = require("../models/Workout");

function normalizeDate(value) {
  if (!value) return undefined;

  const start = new Date(value);
  if (Number.isNaN(start.getTime())) return null;

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { $gte: start, $lt: end };
}

async function addWorkout(req, res, next) {
  try {
    const workout = await Workout.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Workout added successfully",
      data: workout
    });
  } catch (error) {
    next(error);
  }
}

async function getAllWorkouts(req, res, next) {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({
      workoutDate: -1
    });

    res.json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    next(error);
  }
}

async function getWorkoutById(req, res, next) {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found"
      });
    }

    res.json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
}

async function updateWorkout(req, res, next) {
  try {
    const allowed = [
      "workoutName",
      "category",
      "duration",
      "caloriesBurned",
      "workoutDate"
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found"
      });
    }

    res.json({
      success: true,
      message: "Workout updated successfully",
      data: workout
    });
  } catch (error) {
    next(error);
  }
}

async function deleteWorkout(req, res, next) {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found"
      });
    }

    res.json({
      success: true,
      message: "Workout deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}

async function searchWorkouts(req, res, next) {
  try {
    const { name, category, date } = req.query;

    const filter = { user: req.user.id };

    if (name) {
      filter.workoutName = { $regex: name, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (date) {
      const dateFilter = normalizeDate(date);

      if (dateFilter === null) {
        return res.status(400).json({
          success: false,
          message: "Invalid date"
        });
      }

      filter.workoutDate = dateFilter;
    }

    const workouts = await Workout.find(filter).sort({ workoutDate: -1 });

    res.json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  searchWorkouts
};
