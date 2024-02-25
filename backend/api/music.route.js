import express from 'express'

import MusicController from './music.controller.js'

const router = express.Router()

router.route('/').get(MusicController.apiGetMusic)

export default router