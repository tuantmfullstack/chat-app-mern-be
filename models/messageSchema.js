import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
      enum: {
        values: ['text', 'img', 'video'],
        message: '{VALUE} is not supported',
      },
    },
    forwardMessage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Message',
    },
    personEmotion: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    fileName: String,
    fileUrl: String,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
