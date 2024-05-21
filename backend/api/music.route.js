import express from "express";

import MusicController from "./music.controller.js";
import CommentsController from "./comments.controller.js";

const router = express.Router();

//MUSIC CONTROLLER
router.route("/").get(MusicController.apiGetMusic);
router.route("/id/:id").get(MusicController.apiGetSongById);
router.route("/genres").get(MusicController.apiGetGenres);

//COMMENTS CONTROLLER
router
  .route("/comments")
  .post(CommentsController.apiPostComment)
  .put(CommentsController.apiUpdateComment)
  .delete(CommentsController.apiDeleteComment);

export default router;
