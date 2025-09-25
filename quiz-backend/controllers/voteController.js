const Vote = require('../models/Vote');
const Quiz = require('../models/Quiz');

const voteQuiz = async (req, res, next) => {
  try {
    const { quizId, chosenOption } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const isCorrect = quiz.correctAnswer === chosenOption;

    const vote = await Vote.create({
      quiz: quiz._id,
      user: req.user._id,
      chosenOption,
      isCorrect
    });

    // ✅ Return vote result AND correct answer immediately
    res.status(201).json({
      message: 'Vote recorded',
      isCorrect, 
      chosenOption,
      correctAnswer: quiz.correctAnswer,
    });

  } catch (err) {
    // handle duplicate vote error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already voted for this quiz' });
    }
    next(err);
  }
};


// Results after 24h
const getResults = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const elapsed = Date.now() - quiz.createdAt.getTime();
    if (elapsed < 24 * 60 * 60 * 1000) {
      return res.status(403).json({ message: 'Results locked until 24h after quiz creation' });
    }

    const votes = await Vote.find({ quiz: quiz._id });
    const totalVotes = votes.length;
    const optionCounts = quiz.options.map((_, i) =>
      votes.filter(v => v.chosenOption === i).length
    );

    res.json({
      question: quiz.question,
      options: quiz.options,
      totalVotes,
      optionCounts,
      correctAnswer: quiz.correctAnswer
    });
  } catch (err) {
    next(err);
  }
};

const getUserStats = async (req, res, next) => {
  try {
    const votes = await Vote.find({ user: req.user._id });

    const total = votes.length;
    const correct = votes.filter(v => v.isCorrect).length;

    res.json({
      totalQuizzesAttempted: total,
      correctAnswers: correct,
      accuracy: total > 0 ? ((correct / total) * 100).toFixed(2) + "%" : "0%"
    });
  } catch (err) {
    next(err);
  }
};

// Global Leaderboard
const leaderboard = async (req, res, next) => {
  try {
    const stats = await Vote.aggregate([
      {
        $group: {
          _id: "$user",
          total: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          total: 1,
          correct: 1,
          accuracy: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $multiply: [{ $divide: ["$correct", "$total"] }, 100] }
            ]
          }
        }
      },
      { $sort: { correct: -1, accuracy: -1, total: -1 } } // sort priority
    ]);

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

// Get vote stats for a specific quiz (Admin)
const getQuizVotes = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const votes = await Vote.find({ quiz: quiz._id });

    const totalVotes = votes.length;
    const optionCounts = quiz.options.map((opt, i) => {
      const count = votes.filter(v => v.chosenOption === i).length;
      return { option: opt, count };
    });

    res.json({
      quizId: quiz._id,
      question: quiz.question,
      totalVotes,
      optionCounts,
      correctAnswer: quiz.correctAnswer
    });
  } catch (err) {
    next(err);
  }
};



module.exports = { voteQuiz, getResults,getUserStats,leaderboard,getQuizVotes };
