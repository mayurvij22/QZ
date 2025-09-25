const express = require('express');
const router = express.Router();
const { voteQuiz, getResults, getUserStats, leaderboard } = require('../controllers/voteController');
const { requireAuth ,requireAdmin} = require('../middleware/authMiddleware');
// const { getQuizVotes } = require('../controllers/voteController');


router.post('/', requireAuth, voteQuiz); // submit vote
router.get('/:quizId/results', getResults); // see results
router.get('/me/stats', requireAuth, getUserStats);
router.get('/leaderboard', leaderboard);
// router.get('/admin/quiz/:quizId/votes', requireAuth, requireAdmin, getQuizVotes);
module.exports = router;





