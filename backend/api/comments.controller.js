import CommentsDAO from '../dao/commentsDAO.js'

export default class CommentsController {
    
    static async apiPostComment(req, res, next){
        try {
            const songId = req.body.songId
            const comment = req.body.comment
            const userInfo = {
                name: req.body.name,
                id: req.body.userId
            }
            const date = new Date()

            const CommentResponse = await CommentsDAO.addComment(
                songId,
                userInfo,
                comment,
                date
            )
            res.json(CommentResponse)
        }
        catch(e){
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateComment(req, res, next){
        try {
            const commentId = req.body.commentId
            const comment = req.body.comment
            const date = new Date()
            const CommentResponse = await CommentsDAO.updateComment(
                commentId,
                req.body.userId,
                comment,
                date
            )

            var { error } = CommentResponse
            if (error) {
                res.status.json({error})
            }
            if (CommentResponse.modifiedCount === 0) {
                throw new Error ("Unable to Update Review")
            }
            res.json(CommentResponse)
        }
        catch(e){
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteComment(req, res, next) {
        try {
            const commentId = req.body.commentId
            const userId = req.body.userId
            const CommentResponse = await CommentsDAO.deleteComment(
                commentId,
                userId
            )
            res.json(CommentResponse)
        }
        catch(e) {
            res.status(500).json({ error: e.message })
        }
    }
}