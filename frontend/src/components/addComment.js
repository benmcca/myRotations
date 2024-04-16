// Benjamin McCabe
// 4/12/24
// IT302 - 002
// Phase 4 Project
// bsm25@njit.edu

import React, { useState } from "react";
import MusicDataService from "../services/musicDataService";
import { Link, useParams, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const AddComment = ({ user }) => {
  let editing = false;
  let initialCommentState = "";
  const location = useLocation();
  const imageURL = location.state.imageURL;
  const imageId = location.state.imageId;
  const imageIndex = location.state.imageIndex;
  const searchValue = location.state.searchValue;
  const music = location.state.music;
  if (location.state && location.state.currentComment) {
    editing = true;
    initialCommentState = location.state.currentComment.comment;
  }

  const [comment, setComment] = useState(initialCommentState);
  const [submitted, setSubmitted] = useState(false);
  let { id } = useParams();

  const onChangeComment = (e) => {
    const comment = e.target.value;
    setComment(comment);
  };

  const saveComment = () => {
    var data = {
      comment: comment,
      name: user.name,
      userId: user.id,
      songId: id,
    };
    if (editing) {
      data.commentId = location.state.currentComment._id;
      MusicDataService.updateComment(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      MusicDataService.createComment(data)
        .then((response) => {
          setSubmitted(true);
        })
        .catch((e) => {});
    }
  };

  return (
    <div>
      {submitted ? (
        <div>
          <h5>Comment Successful</h5>
          <Link
            to={"/music/" + id}
            state={{
              imageURL: imageURL,
              imageId: imageId,
              imageIndex: imageIndex,
              searchValue: searchValue,
              music: music,
            }}
          >
            Back to Song
          </Link>
        </div>
      ) : (
        <Form>
          <Form.Group>
            <Form.Label>{editing ? "Edit" : "Add"} Comment</Form.Label>
            <Form.Control
              type="text"
              required
              value={comment}
              onChange={onChangeComment}
            />
          </Form.Group>

          <Button variant="primary" onClick={saveComment}>
            Done
          </Button>
        </Form>
      )}
    </div>
  );
};

export default AddComment;
