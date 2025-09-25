const Quiz = require("../models/Quiz");
const Vote = require("../models/Vote");

/**
 * Get all quizzes with vote counts and correct answer stats
 * Admin-only
 */
exports.getQuizzesWithStats = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });

    const quizStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const votes = await Vote.find({ quiz: quiz._id });

        const totalVotes = votes.length;
        const correctVotes = votes.filter((v) => v.isCorrect).length;

        const optionCounts = quiz.options.map((opt, idx) => ({
          option: opt,
          count: votes.filter((v) => v.chosenOption === idx).length,
        }));

        return {
          _id: quiz._id,
          question: quiz.question,
          options: quiz.options,
          correctAnswer: quiz.correctAnswer,
          totalVotes,
          correctVotes,
          optionCounts,
          createdAt: quiz.createdAt,
        };
      })
    );

    res.json(quizStats);
  } catch (err) {
    console.error("Admin getQuizzesWithStats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
