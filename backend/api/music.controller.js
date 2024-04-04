// Benjamin McCabe
// 3/1/2024
// IT302 - 002
// Phase 2 Assignment
// bsm25@njit.edu

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

    static async apiGetSongById(req, res, next) {
        try {
          let id = req.params.id || {}
          let song = await MusicDAO.getSongById(id)
          if(!song) {
            res.status(404).json({ error: "not found"})
            return
          }
          res.json(song)
        } 
        catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: `${e}`})
        }
    }
    
}