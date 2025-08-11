const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const { sendMessage } = require('../services/messageHandler');

const prisma = new PrismaClient();

/**
 * Get messages for a session
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function getMessages(req, res, next) {
  try {
    const { sessionId } = req.params;
    const { limit = 50, offset = 0, phone } = req.query;

    // Build query
    const query = {
      where: {
        sessionId: parseInt(sessionId)
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    };

    // Add phone filter if provided
    if (phone) {
      query.where.OR = [
        { fromNumber: { contains: phone } },
        { toNumber: { contains: phone } }
      ];
    }

    // Get messages
    const messages = await prisma.message.findMany(query);

    // Get total count
    const totalCount = await prisma.message.count({
      where: query.where
    });

    res.status(200).json({
      status: 'success',
      data: {
        messages,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      }
    });
  } catch (error) {
    logger.error(`Error getting messages for session ${req.params.sessionId}:`, error);
    next(error);
  }
}

/**
 * Send a message
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function sendMessageHandler(req, res, next) {
  try {
    const { sessionId } = req.params;
    const { to, message } = req.body;

    // Validate required fields
    if (!to || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Recipient (to) and message are required'
      });
    }

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { id: parseInt(sessionId) }
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: `Session with ID ${sessionId} not found`
      });
    }

    // Check if session is connected
    if (session.status !== 'connected') {
      return res.status(400).json({
        status: 'error',
        message: `Session ${sessionId} is not connected`
      });
    }

    // Send message
    const sentMessage = await sendMessage(parseInt(sessionId), to, message);

    res.status(200).json({
      status: 'success',
      data: sentMessage
    });
  } catch (error) {
    logger.error(`Error sending message for session ${req.params.sessionId}:`, error);
    next(error);
  }
}

/**
 * Get a message by ID
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function getMessageById(req, res, next) {
  try {
    const { id } = req.params;
    
    const message = await prisma.message.findUnique({
      where: { id: parseInt(id) }
    });

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: `Message with ID ${id} not found`
      });
    }

    res.status(200).json({
      status: 'success',
      data: message
    });
  } catch (error) {
    logger.error(`Error getting message ${req.params.id}:`, error);
    next(error);
  }
}

module.exports = {
  getMessages,
  sendMessageHandler,
  getMessageById
};

