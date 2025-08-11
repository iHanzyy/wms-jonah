const express = require('express');
const webhookController = require('../controllers/webhook.controller');

const router = express.Router();

/**
 * @route   POST /api/webhook/:sessionId
 * @desc    Handle incoming webhook
 * @access  Public
 */
router.post('/:sessionId', webhookController.handleWebhook);

/**
 * @route   POST /api/webhook/:sessionId/register
 * @desc    Register a webhook
 * @access  Public
 */
router.post('/:sessionId/register', webhookController.registerWebhook);

/**
 * @route   GET /api/webhook/:sessionId
 * @desc    Get webhooks for a session
 * @access  Public
 */
router.get('/:sessionId', webhookController.getWebhooks);

/**
 * @route   DELETE /api/webhook/:id
 * @desc    Delete a webhook
 * @access  Public
 */
router.delete('/:id', webhookController.deleteWebhook);

module.exports = router;

