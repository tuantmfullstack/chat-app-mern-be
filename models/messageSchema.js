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
    text: String,
    type: {
      type: String,
      required: true,
      enum: {
        values: ['text', 'img', 'file'],
        message: '{VALUE} is not supported',
      },
    },
    forwardMessage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Message',
    },
    emotions: {
      type: [String],
      enum: ['LOVE', 'SMILE', 'WOW', 'SAD', 'ANGRY', 'LIKE', 'DISLIKE'],
      default: [],
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
