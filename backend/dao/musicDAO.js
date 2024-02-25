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
            const subQueries = []
            
            if ("trackName" in filters) {
                const trackNameSubString = new RegExp(filters["trackName"], 'i')
                subQueries.push({ "results.trackName": { $regex: trackNameSubString } })
            }
            
            if ("artistName" in filters) {
                const artistNameSubString = new RegExp(filters["artistName"], 'i')
                subQueries.push({ "results.artistName": { $regex: artistNameSubString } })
            }
            
            // Combine sub-queries using logical AND
            if (subQueries.length > 0) {
                query = { $and: subQueries };
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