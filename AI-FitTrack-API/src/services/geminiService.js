const { GoogleGenerativeAI } = require("@google/generative-ai");

function getModel() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

async function generateRecommendation({ age, fitnessGoal, experienceLevel }) {
  const model = getModel();

  if (!model) {
    return {
      mode: "fallback",
      recommendation:
        "Gemini API key is not configured. Add GEMINI_API_KEY to .env to receive AI-generated recommendations.",
      input: { age, fitnessGoal, experienceLevel }
    };
  }

  const prompt = `
You are a fitness recommendation assistant.
Create a practical, beginner-friendly workout recommendation based on:
Age: ${age}
Fitness Goal: ${fitnessGoal}
Experience Level: ${experienceLevel}

Return:
1. Weekly workout plan
2. Suggested exercises
3. Training tips
4. Safety recommendations

Do not diagnose medical conditions. Keep the response concise and structured.
`;

  const result = await model.generateContent(prompt);
  return {
    mode: "gemini",
    recommendation: result.response.text()
  };
}

async function generateInsights({ totalWorkouts, averageDuration, totalCalories }) {
  const model = getModel();

  if (!model) {
    return {
      mode: "fallback",
      insight:
        `You completed ${totalWorkouts} workouts, averaging ${averageDuration} minutes and ${totalCalories} calories burned in total. Configure GEMINI_API_KEY for AI-generated insights.`
    };
  }

  const prompt = `
Analyze these workout statistics:
Total workouts: ${totalWorkouts}
Average workout duration: ${averageDuration} minutes
Total calories burned: ${totalCalories}

Provide:
- Performance analysis
- Improvement suggestions
- Motivational advice
- Progress summary

Do not diagnose medical conditions.
`;

  const result = await model.generateContent(prompt);
  return {
    mode: "gemini",
    insight: result.response.text()
  };
}

module.exports = { generateRecommendation, generateInsights };
