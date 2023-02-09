import express from 'express';
import { protect } from '../controllers/authController.js';
import {
  createMessage,
  deleteMessages,
  emotionMessage,
  getMessagesByConversation,
} from '../controllers/messageController.js';

const router = express.Router();

router.use(protect);

router.post('', createMessage);
router.get('/:conversationId', getMessagesByConversation);
router.route('/:id').post(emotionMessage).delete(deleteMessages);

export default router;
