// Benjamin McCabe
// 3/1/2024
// IT302 - 002
// Phase 2 Assignment
// bsm25@njit.edu

import express from 'express'

import MusicController from './music.controller.js'

const router = express.Router()

router.route('/').get(MusicController.apiGetMusic)

export default router