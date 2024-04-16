// Benjamin McCabe
// 4/12/24
// IT302 - 002
// Phase 4 Project
// bsm25@njit.edu

import React, { useState, useEffect } from "react";
import MusicDataService from "../services/musicDataService";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { flushSync } from "react-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import "./style.css";

const Song = ({ user }) => {
  const [song, setSong] = useState({
    id: null,
    title: "",
    comments: [],
  });
  const [songPreview, setSongPreview] = useState(null);
  let { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getSong(id);
  }, [id]);
  const location = useLocation();
  const imageURL = location.state.imageURL;
  const imageId = location.state.imageId;
  const imageIndex = location.state.imageIndex;
  const searchValue = location.state.searchValue;
  const music = location.state.music;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const image = document.getElementById("songImage");
      if (image) {
        image.classList.add("scaledDown");
      }
    }, 30);
    return () => clearTimeout(timeout); // Cleanup function to clear the timeout on unmount
  }, []);

  const getSong = (id) => {
    MusicDataService.get(id)
      .then((response) => {
        setSong(response.data);
        setSongPreview(response.data.previewUrl);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteComment = (commentId, index) => {
    MusicDataService.deleteComment(commentId, user.id)
      .then((response) => {
        // Create a new array without the deleted comment
        const updatedComments = [
          ...song.comments.slice(0, index),
          ...song.comments.slice(index + 1),
        ];
        // Update the state with the new array
        setSong((prevState) => ({
          ...prevState,
          comments: updatedComments,
        }));
      })
      .catch((e) => {
        console.log(e);
      });
  };


  return (
    <div className="songPage">
      <img
        src="https://cdn-icons-png.flaticon.com/512/32/32213.png"
        alt="backButton"
        className="back-icon"
        onClick={() => {
          document.startViewTransition(() => {
            flushSync(() => {
              navigate(`/music`, {
                state: {
                  goToIndex: imageIndex,
                  searchValue: searchValue,
                  music: music,
                },
              });
            });
          });
        }}
      />
      <Row>
        <Col>
          <img
            id="songImage"
            src={imageURL}
            style={{
              viewTransitionName: "image" + imageId,
            }}
            className="songPageImage"
            onClick={() => {
              document.startViewTransition(() => {
                flushSync(() => {
                  navigate(`/music`, {
                    state: {
                      goToIndex: imageIndex,
                      searchValue: searchValue,
                      music: music,
                    },
                  });
                });
              });
            }}
          />
        </Col>
        <Col className="rightHandSide">
          <h3 className="albumName">{song.collectionCensoredName}</h3>
          <h5 className="artistName">{song.artistName}</h5>
          <p className="date">
            {new Date(Date.parse(song.releaseDate)).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
          </p>

          <div className="musicContainer">
            <div className="audioNameDiv">{song.trackName}</div>
            <div className="audioDiv">
              {songPreview && (
                <>
                  <audio controls>
                    <source src={songPreview} type="audio/mp4" />
                    Your browser does not support the audio element.
                  </audio>
                </>
              )}
            </div>
          </div>

          <h5 className="commentsSectionHeader">
            Comments
            {user ? (
              <Link
                to={"/music/" + id + "/comment"}
                state={{
                  imageURL: imageURL,
                  imageId: imageId,
                  imageIndex: imageIndex,
                  searchValue: searchValue,
                  music: music,
                }}
              >
                <img
                  src="https://png.pngtree.com/element_our/sm/20180516/sm_5afbe35ff3ec9.jpg"
                  alt="AddComment"
                  className="add-icon"
                />
              </Link>
            ) : (
              <Link to={"/login"}>
                <img
                  src="https://png.pngtree.com/element_our/sm/20180516/sm_5afbe35ff3ec9.jpg"
                  alt="AddComment"
                  className="add-icon"
                />
              </Link>
            )}
          </h5>

          <div className="commentsDiv">
            {song.comments.map((comment, index) => {
              return (
                <div className="comment">
                  <div className="commentHeader">
                    <h6 className="commentName">{comment.name}</h6>
                    <div className="commentDate">
                      <h6>
                        {new Date(Date.parse(comment.date)).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </h6>
                    </div>
                  </div>
                  <p className="commentContent">{comment.comment}</p>
                  {user && user.id === comment.userId && (
                    <div className="commentActions">
                      <Link
                        to={"/music/" + id + "/comment"}
                        state={{
                          currentComment: comment,
                          imageURL: imageURL,
                          imageId: imageId,
                          imageIndex: imageIndex,
                          searchValue: searchValue,
                          music: music,
                        }}
                      >
                        <img
                          src="https://static-00.iconduck.com/assets.00/edit-pencil-icon-512x512-awl8cu9b.png"
                          className="edit-icon"
                        />
                      </Link>
                      <button
                        variant="link"
                        onClick={() => deleteComment(comment._id, index)}
                      >
                        <img
                          src="https://cdn.icon-icons.com/icons2/2518/PNG/512/x_icon_150997.png"
                          className="delete-icon"
                        />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Song;
