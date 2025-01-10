const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    
    blog_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    },
    blog_author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Blog',
    },
    comment: {
        type: String,
        required: true
    },
    children: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment'
    },
    commented_by: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    isReply: {
        type: Boolean,
        default: false,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }

},
{
    timestamps: {
        createdAt: 'commentedAt'
    }
})

module.exports = model("Comment", CommentSchema)