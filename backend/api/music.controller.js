import MusicDAO from "../dao/musicDAO.js";

export default class MusicController {
    static async apiGetMusic(req, res, next) {
        const songsPerPage = req.query.songsPerPage ? parseInt(req.query.songsPerPage) : 20
        const page = req.query.page ? parseInt(req.query.page) : 0

        let filters = {}
        if (req.query.trackName) {
            filters.trackName = req.query.trackName
        }
        if (req.query.artistName) {
            filters.artistName = req.query.artistName
        }

        const {songList, totalNumSongs} = await MusicDAO.getMusic({filters, page, songsPerPage})

        let response = {
            songs: songList,
            page: page,
            filters: filters,
            entries_per_page: songsPerPage,
            totalNumSongs: totalNumSongs,
        }
        res.json(response)
    }
}