import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let comments
export default class CommentsDAO {
    static async injectDB(conn) {
        if (comments) {
            return
        }
        try {
            comments = await conn.db(process.env.MUSIC_NS).collection('comments_bsm25')
        }
        catch (e) {
            console.error(`Unable to establish connection handle in commentsDAO: ${e}`)
        }
    }

    static async addComment(songId, userInfo, comment, date) {
        try {
            const commentDoc = {
                name: userInfo.name,
                userId: userInfo.userId,
                date: date,
                comment: comment,
                songId: new ObjectId(songId)
            }
            return await comments.insertOne(commentDoc)
        }
        catch (e) {
            console.error(`Unable to post comment: ${e}`)
            console.error(e)
            return { error : e}
        }
    }

    static async updateComment(commentId, userId, comment, date) {
        try {
            const updateResponse = await comments.updateOne(
                { userId: userId, id: new ObjectId(commentId) },
                { $set: { comment: comment, date: date} }
            )
            return updateResponse
        }
        catch (e) {
            console.error(`Unable to update comment: ${e}`)
            console.error(e)
            return { error : e}
        }
    }

    static async deleteComment(commentId, userId) {
        try {
            const deleteResponse = await comments.deleteOne(
                { id: new ObjectId(commentId), userId: userId }
            )
            return deleteResponse
        }
        catch (e) {
            console.error(`Unable to delete comment: ${e}`)
            console.error(e)
            return { error : e}
        }
    }
}