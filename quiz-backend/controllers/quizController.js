const Quiz = require('../models/Quiz');

const Vote = require('../models/Vote');

// Admin only: create quiz
const createQuiz = async (req, res, next) => {
  try {
    const { question, options, correctAnswer } = req.body;
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ message: 'Invalid quiz data' });
    }
    const quiz = await Quiz.create({
      question,
      options,
      correctAnswer,
      createdBy: req.user._id
    });
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
};
// Get all quizzes
const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name email');

    let votes = [];

    // Only fetch votes if logged-in user is admin
    if (req.user?.role === 'admin') {
      votes = await Vote.find().populate('user', 'name');
    }

    const formattedQuizzes = quizzes.map(quiz => {
      const optionCounts = quiz.options.map((_, i) => {
        // Get voters only if admin, otherwise empty array
        const votersForOption = votes
          .filter(v => v.quiz.toString() === quiz._id.toString() && v.chosenOption === i)
          .map(v => v.user.name);

        return {
          count: votersForOption.length,
          voters: votersForOption
        };
      });

      return {
        _id: quiz._id,
        question: quiz.question,
        options: quiz.options,
        correctAnswer: quiz.correctAnswer,
        createdBy: quiz.createdBy,
        optionCounts
      };
    });

    res.json(formattedQuizzes);
  } catch (err) {
    next(err);
  }
};


// Public: get quiz by ID
const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

// Admin: delete quiz
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    next(err);
  }
};


// Admin: update quiz
const updateQuiz = async (req, res, next) => {
  try {
    const { question, options, correctAnswer } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    quiz.question = question || quiz.question;
    quiz.options = options || quiz.options;
    quiz.correctAnswer = correctAnswer ?? quiz.correctAnswer;

    await quiz.save();
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};


// const getQuizById = async (req, res) => {
//   try {
//     const quiz = await Quiz.findById(req.params.id);
//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

//     // Aggregate votes for each option
//     const votes = await Vote.find({ quiz: quiz._id }).populate('user', 'name');

//     const optionCounts = quiz.options.map((_, i) => {
//       const voters = votes
//         .filter(v => v.chosenOption === i)
//         .map(v => ({ name: v.user.name, isCorrect: v.isCorrect }));
//       return { count: voters.length, voters };
//     });

//     res.json({ ...quiz.toObject(), optionCounts });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Fetch votes for this quiz
    const votes = await Vote.find({ quiz: quiz._id }).populate('user', 'name');

    // Build optionCounts with voter names and isCorrect
    const optionCounts = quiz.options.map((_, i) => {
      const voters = votes
        .filter(v => v.chosenOption === i)
        .map(v => ({ name: v.user.name, isCorrect: v.isCorrect }));
      return { count: voters.length, voters };
    });

    res.json({ ...quiz.toObject(), optionCounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// const getUserQuizzes = async (req, res, next) => {
//   try {
//     const quizzes = await Quiz.find();
//     const votes = await Vote.find({ user: req.user._id });

//     const voteMap = {};
//     votes.forEach(v => voteMap[v.quiz.toString()] = v);

//     res.json({
//       quizzes: quizzes.map(q => ({
//         ...q.toObject(),
//         userVote: voteMap[q._id.toString()] || null
//       }))
//     });
//   } catch (err) {
//     next(err);
//   }
// };

  const getQuizzesWithVotes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();

    const result = await Promise.all(
      quizzes.map(async quiz => {
        const votes = await Vote.find({ quiz: quiz._id }).populate('user', 'name');

        const optionsWithVotes = quiz.options.map((opt, idx) => {
          const voters = votes
            .filter(v => v.chosenOption === idx)
            .map(v => v.user.name);
          return { text: opt, votes: voters.length, voters };
        });

        return {
          _id: quiz._id,
          question: quiz.question,
          options: optionsWithVotes
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { createQuiz,getQuizzesWithVotes, getQuizzes, getQuiz, deleteQuiz,updateQuiz,getQuizById };
