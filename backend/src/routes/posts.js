/**
 * Skill Post Routes
 */

const express = require('express');
const router = express.Router();
const { verifyFirebaseToken, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateSkillPost, validateSearch, validateId } = require('../middleware/validation');
const postController = require('../controllers/postController');

// GET /api/posts - Get all posts with filters
router.get('/', validateSearch, optionalAuth, asyncHandler(postController.getPosts));

// GET /api/posts/featured - Get featured/boosted posts
router.get('/featured', asyncHandler(postController.getFeaturedPosts));

// GET /api/posts/nearby - Get posts near user location
router.get('/nearby', verifyFirebaseToken, asyncHandler(postController.getNearbyPosts));

// GET /api/posts/:id - Get post by ID
router.get('/:id', validateId, asyncHandler(postController.getPostById));

// POST /api/posts - Create new post
router.post('/', verifyFirebaseToken, validateSkillPost, asyncHandler(postController.createPost));

// PUT /api/posts/:id - Update post
router.put('/:id', verifyFirebaseToken, validateId, validateSkillPost, asyncHandler(postController.updatePost));

// DELETE /api/posts/:id - Delete post
router.delete('/:id', verifyFirebaseToken, validateId, asyncHandler(postController.deletePost));

// POST /api/posts/:id/boost - Boost post (paid feature)
router.post('/:id/boost', verifyFirebaseToken, validateId, asyncHandler(postController.boostPost));

// POST /api/posts/:id/complete - Mark post as completed
router.post('/:id/complete', verifyFirebaseToken, validateId, asyncHandler(postController.completePost));

// POST /api/posts/:id/report - Report post
router.post('/:id/report', verifyFirebaseToken, validateId, asyncHandler(postController.reportPost));

// GET /api/posts/search/suggestions - Get search suggestions
router.get('/search/suggestions', asyncHandler(postController.getSearchSuggestions));

module.exports = router;


