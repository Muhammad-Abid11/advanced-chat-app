import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isGroupChat: {
        type: Boolean,
        default: false
    },
    chatName: {
        type: String,
        trim: true
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
chatSchema.index({ participants: 1 });

export default model('Chat', chatSchema);
