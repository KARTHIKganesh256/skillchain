/**
 * Chat Routes
 */

const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateMessage, validateId } = require('../middleware/validation');
const chatController = require('../controllers/chatController');

// GET /api/chats - Get all chats for current user
router.get('/', verifyFirebaseToken, asyncHandler(chatController.getChats));

// GET /api/chats/:id - Get chat by ID
router.get('/:id', verifyFirebaseToken, validateId, asyncHandler(chatController.getChatById));

// POST /api/chats - Create new chat
router.post('/', verifyFirebaseToken, asyncHandler(chatController.createChat));

// GET /api/chats/:id/messages - Get messages for a chat
router.get('/:id/messages', verifyFirebaseToken, validateId, asyncHandler(chatController.getMessages));

// POST /api/chats/:id/messages - Send message
router.post('/:id/messages', verifyFirebaseToken, validateId, validateMessage, asyncHandler(chatController.sendMessage));

// PUT /api/chats/:id/read - Mark chat as read
router.put('/:id/read', verifyFirebaseToken, validateId, asyncHandler(chatController.markAsRead));

// DELETE /api/chats/:id - Delete chat
router.delete('/:id', verifyFirebaseToken, validateId, asyncHandler(chatController.deleteChat));

// POST /api/chats/:id/typing - Send typing indicator
router.post('/:id/typing', verifyFirebaseToken, validateId, asyncHandler(chatController.sendTypingIndicator));

module.exports = router;


