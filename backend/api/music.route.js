// Benjamin McCabe
// 3/1/2024
// IT302 - 002
// Phase 2 Assignment
// bsm25@njit.edu

import express from "express";

import MusicController from "./music.controller.js";
import CommentsController from "./comments.controller.js";

const router = express.Router();

//MUSIC CONTROLLER
router.route("/").get(MusicController.apiGetMusic);
router.route("/:id").get(MusicController.apiGetSongById);

//COMMENTS CONTROLLER
router
  .route("/comments")
  .post(CommentsController.apiPostComment)
  .put(CommentsController.apiUpdateComment)
  .delete(CommentsController.apiDeleteComment);

export default router;
