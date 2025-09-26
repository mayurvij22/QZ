const express = require('express');
const router = express.Router();
const { 
  createQuiz, 
  getQuizzes, 
  getQuiz, 
  deleteQuiz, 
  updateQuiz, 
   getQuizById, // <-- new controller
  getQuizzesWithVotes 
} = require('../controllers/quizController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Regular user routes
router.get('/', requireAuth, getQuizzes);

// ⚡ Place /admin BEFORE /:id to avoid conflict
router.get('/admin', requireAuth, requireAdmin, getQuizzesWithVotes);
router.get("/admin/quizzes/:id", requireAuth, requireAdmin, getQuizById); // <-- new endpoint

// Single quiz by ID
router.get('/:id', requireAuth, getQuiz);

// CRUD routes for admin
router.post('/', requireAuth, requireAdmin, createQuiz);
router.put('/:id', requireAuth, requireAdmin, updateQuiz);
router.delete('/:id', requireAuth, requireAdmin, deleteQuiz);

module.exports = router;
