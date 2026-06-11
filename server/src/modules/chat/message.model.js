import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ""
    },
    images: [{
        type: String
    }],
    video: {
        type: String,
        default: ""
    },
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    readBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});
messageSchema.index({ chatId: 1 });

export default model('Message', messageSchema);
