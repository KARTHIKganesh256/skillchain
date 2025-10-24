/**
 * Match Routes
 */

const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateId } = require('../middleware/validation');
const matchController = require('../controllers/matchController');

// GET /api/matches - Get all matches for current user
router.get('/', verifyFirebaseToken, asyncHandler(matchController.getMatches));

// GET /api/matches/suggestions - Get match suggestions based on skills
router.get('/suggestions', verifyFirebaseToken, asyncHandler(matchController.getMatchSuggestions));

// POST /api/matches - Create a match (interest in a post)
router.post('/', verifyFirebaseToken, asyncHandler(matchController.createMatch));

// GET /api/matches/:id - Get match details
router.get('/:id', verifyFirebaseToken, validateId, asyncHandler(matchController.getMatchById));

// POST /api/matches/:id/accept - Accept match
router.post('/:id/accept', verifyFirebaseToken, validateId, asyncHandler(matchController.acceptMatch));

// POST /api/matches/:id/reject - Reject match
router.post('/:id/reject', verifyFirebaseToken, validateId, asyncHandler(matchController.rejectMatch));

// POST /api/matches/:id/complete - Complete match and transfer SkillCoins
router.post('/:id/complete', verifyFirebaseToken, validateId, asyncHandler(matchController.completeMatch));

// POST /api/matches/:id/rate - Rate the match partner
router.post('/:id/rate', verifyFirebaseToken, validateId, asyncHandler(matchController.rateMatch));

module.exports = router;


