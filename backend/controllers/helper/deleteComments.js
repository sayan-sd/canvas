const Blog = require("../../models/Blog");
const Comment = require("../../models/Comment");
const Notification = require("../../models/Notification");

const deleteComments = (_id) => {
    Comment.findOneAndDelete({ _id }).then((comment) => {
        // delete a reply
        if (comment.parent) {
            // update parent
            Comment.findOneAndUpdate(
                { _id: comment.parent },
                { $pull: { children: _id } }
            )
                .then(() => {})
                .catch((err) => console.log(err));
        }

        // delete from notifications
        Notification.findOneAndDelete({ comment: _id }).then(
            (notification) => {}
        );

        // delete reply notifications
        Notification.findOneAndDelete({ reply: _id }).then(
            (notifications) => {}
        );

        // del from blog comments arr
        Blog.findOneAndUpdate(
            { _id: comment.blog_id },
            {
                $pull: { comments: _id },
                $inc: {
                    "activity.total_comments": -1,
                    "activity.total_parent_comments": comment.parent ? 0 : -1,
                },
            }
        ).then(blog => {
            // if has reply, loop and delete
            if (comment.children.length) {
                comment.children.map(replies => {
                    deleteComments(replies);
                })
            }
        })
    }).catch(err => {
        console.log(err);
    })
};

module.exports = deleteComments;
