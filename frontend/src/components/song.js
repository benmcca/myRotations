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
  const location = useLocation();
  let imageURL, imageId, imageIndex, searchValue, music;
  if (location.state) {
    imageURL = location.state.imageURL;
    imageId = location.state.imageId;
    imageIndex = location.state.imageIndex;
    searchValue = location.state.searchValue;
    music = location.state.music;
  }

  useEffect(() => {
    getSong(id);
  }, [id]);

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
        className="back-icon"
        alt="backButton"
        src="https://cdn-icons-png.flaticon.com/512/32/32213.png"
        onClick={() => {
          if (typeof document.startViewTransition === "function") {
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
          } else {
            navigate(`/music`, {
              state: {
                goToIndex: imageIndex,
                searchValue: searchValue,
                music: music,
              },
            });
          }
        }}
      />
      <Row>
        <Col className="leftHandSide">
          <img
            className="songPageImage"
            id="songImage"
            style={{ viewTransitionName: "image" + imageId }}
            src={imageURL}
            onClick={() => {
              if (typeof document.startViewTransition === "function") {
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
              } else {
                navigate(`/music`, {
                  state: {
                    goToIndex: imageIndex,
                    searchValue: searchValue,
                    music: music,
                  },
                });
              }
            }}
          />
        </Col>
        <Col className="rightHandSide">
          <h3 className="albumName">{song.collectionCensoredName}</h3>

          <h5
            className="artistName"
            onClick={() => {
              if (typeof document.startViewTransition === "function") {
                document.startViewTransition(() => {
                  flushSync(() => {
                    navigate(`/music`, {
                      state: {
                        artist: song.artistName,
                      },
                    });
                  });
                });
              } else {
                navigate(`/music`, {
                  state: {
                    artist: song.artistName,
                  },
                });
              }
            }}
          >
            {song.artistName}
          </h5>
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
              <img
                className="add-icon"
                alt="AddComment"
                src="https://png.pngtree.com/element_our/sm/20180516/sm_5afbe35ff3ec9.jpg"
                onClick={() => {
                  if (typeof document.startViewTransition === "function") {
                    document.startViewTransition(() => {
                      flushSync(() => {
                        navigate("/music/" + id + "/comment", {
                          state: {
                            imageURL: imageURL,
                            imageId: imageId,
                            imageIndex: imageIndex,
                            searchValue: searchValue,
                            music: music,
                            song: song,
                          },
                        });
                      });
                    });
                  } else {
                    navigate("/music/" + id + "/comment", {
                      state: {
                        imageURL: imageURL,
                        imageId: imageId,
                        imageIndex: imageIndex,
                        searchValue: searchValue,
                        music: music,
                        song: song,
                      },
                    });
                  }
                }}
              />
            ) : (
              <img
                className="add-icon"
                alt="AddComment"
                src="https://png.pngtree.com/element_our/sm/20180516/sm_5afbe35ff3ec9.jpg"
                onClick={() => {
                  if (typeof document.startViewTransition === "function") {
                    document.startViewTransition(() => {
                      flushSync(() => {
                        navigate("/login", {
                          state: {
                            songId: id,
                            imageURL: imageURL,
                            imageId: imageId,
                            imageIndex: imageIndex,
                            searchValue: searchValue,
                            music: music,
                          },
                        });
                      });
                    });
                  } else {
                    navigate("/login", {
                      state: {
                        songId: id,
                        imageURL: imageURL,
                        imageId: imageId,
                        imageIndex: imageIndex,
                        searchValue: searchValue,
                        music: music,
                      },
                    });
                  }
                }}
              />
            )}
          </h5>

          <div className="commentsDiv">
            {song.comments.length > 0 ? (
              <div>
                {song.comments.map((comment, index) => {
                  return (
                    <div className="comment">
                      <div className="commentHeader">
                        <h6 className="commentName">{comment.name}</h6>
                        <div className="commentDate">
                          <h6>
                            {new Date(
                              Date.parse(comment.date)
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </h6>
                        </div>
                      </div>
                      <p className="commentContent">{comment.comment}</p>
                      {user &&
                        user.name === comment.name &&
                        user.id === comment.userId && (
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
                                song: song,
                              }}
                            >
                              <img
                                className="edit-icon"
                                src="https://static-00.iconduck.com/assets.00/edit-pencil-icon-512x512-awl8cu9b.png"
                              />
                            </Link>
                            <button
                              variant="link"
                              onClick={() => deleteComment(comment._id, index)}
                            >
                              <img
                                className="delete-icon"
                                src="https://cdn.icon-icons.com/icons2/2518/PNG/512/x_icon_150997.png"
                              />
                            </button>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className="noComments">No Comments</div>
                {user ? (
                  <div
                    className="noCommentsDescription"
                    onClick={() => {
                      if (typeof document.startViewTransition === "function") {
                        document.startViewTransition(() => {
                          flushSync(() => {
                            navigate("/music/" + id + "/comment", {
                              state: {
                                imageURL: imageURL,
                                imageId: imageId,
                                imageIndex: imageIndex,
                                searchValue: searchValue,
                                music: music,
                                song: song,
                              },
                            });
                          });
                        });
                      } else {
                        navigate("/music/" + id + "/comment", {
                          state: {
                            imageURL: imageURL,
                            imageId: imageId,
                            imageIndex: imageIndex,
                            searchValue: searchValue,
                            music: music,
                            song: song,
                          },
                        });
                      }
                    }}
                  >
                    Be the first to share what you think!
                  </div>
                ) : (
                  <div
                    className="noCommentsDescription"
                    onClick={() => {
                      if (typeof document.startViewTransition === "function") {
                        document.startViewTransition(() => {
                          flushSync(() => {
                            navigate("/login", {
                              state: {
                                songId: id,
                                imageURL: imageURL,
                                imageId: imageId,
                                imageIndex: imageIndex,
                                searchValue: searchValue,
                                music: music,
                              },
                            });
                          });
                        });
                      } else {
                        navigate("/login", {
                          state: {
                            songId: id,
                            imageURL: imageURL,
                            imageId: imageId,
                            imageIndex: imageIndex,
                            searchValue: searchValue,
                            music: music,
                          },
                        });
                      }
                    }}
                  >
                    Be the first to share what you think!
                  </div>
                )}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Song;
