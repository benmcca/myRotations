import React, { useState } from "react";
import MusicDataService from "../services/musicDataService";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { flushSync } from "react-dom";

const AddComment = ({ user }) => {
  let editing = false;
  let initialCommentState = "";
  const navigate = useNavigate();
  const location = useLocation();
  const imageURL = location.state.imageURL;
  const imageId = location.state.imageId;
  const imageIndex = location.state.imageIndex;
  const searchValue = location.state.searchValue;
  const music = location.state.music;
  const song = location.state.song;
  const genre = location.state.genre;
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
    if (comment != "") {
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
    }
  };

  return (
    <div>
      <img
        className="back-icon"
        alt="backButton"
        src="https://cdn-icons-png.flaticon.com/512/32/32213.png"
        onClick={() => {
          if (typeof document.startViewTransition === "function") {
            document.startViewTransition(() => {
              flushSync(() => {
                navigate(`/music/${id}`, {
                  state: {
                    imageURL: imageURL,
                    imageId: imageId,
                    imageIndex: imageIndex,
                    searchValue: searchValue,
                    music: music,
                    genre: genre,
                  },
                });
              });
            });
          } else {
            navigate(`/music/${id}`, {
              state: {
                imageURL: imageURL,
                imageId: imageId,
                imageIndex: imageIndex,
                searchValue: searchValue,
                music: music,
                genre: genre,
              },
            });
          }
        }}
      />
      <div className="centered">
        <div className="addCommentSong">
          <img className="addCommentImage" src={imageURL} />
          <div className="addCommentInfoSection">
            <h3 className="addcommentSongInfoh3">
              {song.collectionCensoredName}
            </h3>
            <h5 className="addcommentSongInfoh5">{song.artistName}</h5>
            <h6 className="addcommentSongInfoh6">{song.trackName}</h6>
          </div>
        </div>
      </div>
      {submitted ? (
        <div className="centered">
          <div className="addCommentResponse">
            <h5>Comment Successful</h5>
            <Link
              to={"/music/" + id}
              state={{
                imageURL: imageURL,
                imageId: imageId,
                imageIndex: imageIndex,
                searchValue: searchValue,
                music: music,
                genre: genre,
              }}
            >
              Back to Song
            </Link>
          </div>
        </div>
      ) : (
        <div className="centered">
          <div className="addCommentInputArea">
            <h3>{editing ? "Edit" : "Add"} Comment</h3>
            <textarea
              type="text"
              placeholder="Comment"
              required
              value={comment}
              onChange={onChangeComment}
            />
            <div className="buttonRow">
              <button onClick={saveComment}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddComment;
