import catchAsync from '../utils/catchAsync.js';
import Message from '../models/messageSchema.js';

export const getMessagesByConversation = catchAsync(async (req, res) => {
  const limit = req.query.limit || 10;
  const skip = req.query.skip;

  const messages = await Message.find({
    conversationId: req.params.conversationId,
  })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const length = messages.length;

  res.status(200).json({
    status: 'success',
    length,
    data: { isContinue: !!length, messages },
  });
});

export const createMessage = catchAsync(async (req, res) => {
  const user = req.user;

  const msg = { ...req.body, senderId: user._id };

  const message = await Message.create(msg);

  res.status(200).json({
    status: 'success',
    data: { message },
  });
});

export const deleteMessages = catchAsync(async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    _id: req.params.id,
  });
});

export const emotionMessage = catchAsync(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message.emotions.includes(req.body.type))
    message.emotions.push(req.body.type);
  await message.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    type: req.body.type,
  });
});
