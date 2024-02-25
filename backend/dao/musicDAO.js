let music

export default class MusicDAO {
    static async injectDB(conn) {
        if (music) {
            return
        }
        try {
            music = await conn.db(process.env.MUSIC_NS).collection('music_bsm25')
        }
        catch(e) {
            console.error(`unable to connect in MusicDAO: ${e}`)
        }
    }

    static async getMusic({
        filters = null,
        page = 0,
        songsPerPage = 20,
        } = {}) {
        
        let query
        if (filters) {
            if ("trackName" in filters) {
                const trackNameSubString = new RegExp(filters["trackName"], 'i') // 'i' flag for case-insensitive matching
                query = {"results.trackName": { $regex: trackNameSubString }}
            }
        }

        let cursor
        try {
            cursor = await music.find(query).limit(songsPerPage).skip(songsPerPage * page)
            const songList = await cursor.toArray()
            const totalNumSongs = await music.countDocuments(query)
            return {songList, totalNumSongs}
        }
        catch(e) {
            console.error(`Unable to issue find command, ${e}`)
            console.error(e)
            return {songList: [], totalNumSongs: 0}
        }
    }
}