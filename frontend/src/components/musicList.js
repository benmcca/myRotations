import React, { useState, useEffect, useRef, useCallback } from "react";
import MusicDataService from "../services/musicDataService";
import { useNavigate, useLocation } from "react-router-dom";
import { flushSync } from "react-dom";
import musicDataService from "../services/musicDataService";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

import "./style.css";
import playButton from "./playButton.svg";
import skipButton from "./skipButton.svg";
import rewindButton from "./rewindButton.svg";
import shuffleButton from "./shuffleButton.svg";
import externalLinkButton from "./externalLinkButton.svg";

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [goToIndex, setGoToIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const el = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (location.state) {
        if (location.state.artist) {
          setSearchTitle(location.state.artist);
          find(location.state.artist, "any");
        } else {
          setSearchTitle(location.state.searchValue);
          setGoToIndex(location.state.goToIndex);
          setMusic(location.state.music);
          setSelectedGenre(location.state.genre);
        }
      } else {
        retrieveMusic();
      }
      retrieveGenres();
    };
    fetchData();

    // Add event listeners for arrow keys
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (goToIndex) {
      target(goToIndex);
    } else {
      target();
    }
  }, [music]);

  const retrieveMusic = () => {
    musicDataService
      .getAll()
      .then((response) => {
        setMusic(response.data.songs);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveGenres = () => {
    musicDataService
      .getGenres()
      .then((response) => {
        setGenres(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSearchTitle = (e) => {
    e.preventDefault(); // stop form from reloading page
    findByTitle();
  };

  const findByTitle = (searchValue) => {
    setSelectedGenre(null);
    if (searchValue) {
      find(searchValue, "any");
    } else {
      find(searchTitle, "any");
    }
  };

  const find = (query, by, genre) => {
    setMusic([]);
    setGoToIndex(0);
    MusicDataService.find(query, by, genre)
      .then((response) => {
        if (query != "") {
          const sortedSongs = response.data.songs.sort((a, b) => {
            // Sort the results by artistName, collectionName, then trackName.
            // Sort the results within each category by date.
            const queryInArtistA = a.artistName
              .toLowerCase()
              .includes(query.toLowerCase());
            const queryInCollectionA = a.collectionName
              .toLowerCase()
              .includes(query.toLowerCase());
            const queryInTrackA = a.trackName
              .toLowerCase()
              .includes(query.toLowerCase());

            const queryInArtistB = b.artistName
              .toLowerCase()
              .includes(query.toLowerCase());
            const queryInCollectionB = b.collectionName
              .toLowerCase()
              .includes(query.toLowerCase());
            const queryInTrackB = b.trackName
              .toLowerCase()
              .includes(query.toLowerCase());

            if (queryInArtistA !== queryInArtistB) {
              return queryInArtistB - queryInArtistA;
            } else if (queryInCollectionA !== queryInCollectionB) {
              return queryInCollectionB - queryInCollectionA;
            } else {
              // If the query matches in all categories, sort by date
              const dateA = new Date(a.releaseDate);
              const dateB = new Date(b.releaseDate);
              return dateA - dateB; // Sort in ascending order (earliest first)
            }
          });
          setMusic(sortedSongs);
        } else {
          setMusic(response.data.songs);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleRandomize = async (e) => {
    if (e) {
      e.preventDefault();
    }
    find("", "any", selectedGenre);
    setSearchTitle("");
  };

  const handleGenreSelect = (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
      find("", "any", null);
    } else {
      setSelectedGenre(genre);
      find("", "any", genre);
    }
    setSearchTitle("");
  };

  //COVER FLOW VARIABLES
  const ITEM_DISTANCE = 200;
  const ITEM_ANGLE = -45;
  const CENTER_ITEM_POP = 500;
  const CENTER_ITEM_DISTANCE = 80;
  function setTransform(el, xpos, zpos, yAngle) {
    el.style.transform = `translateX(${xpos}px) translateZ(${zpos}px) rotateY(${yAngle}deg)`;
  }
  function target(index = 0, _id, albumCover, searchValue, music) {
    if (el.current) {
      setHoveredIndex(null);
      // if clicked on an item and it is in the currentIndex, take user to songPage
      if (index === currentIndex && _id) {
        if (typeof document.startViewTransition === "function") {
          document.startViewTransition(() => {
            flushSync(() => {
              navigate(`/music/${_id}`, {
                state: {
                  imageId: _id,
                  imageURL: albumCover,
                  imageIndex: index,
                  searchValue: searchValue,
                  music: music,
                  genre: selectedGenre,
                },
              });
            });
          });
        } else {
          navigate(`/music/${_id}`, {
            state: {
              imageId: _id,
              imageURL: albumCover,
              imageIndex: index,
              searchValue: searchValue,
              music: music,
              genre: selectedGenre,
            },
          });
        }
      } else {
        // update the text below album to current info
        setCurrentIndex(index);
      }

      const items = el.current.children;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // Center item position and angle
        if (i === index) {
          setTransform(item, 0, CENTER_ITEM_POP, 0);
        }
        // Left items position and angle
        else if (i < index) {
          setTransform(
            item,
            (i - index) * ITEM_DISTANCE - CENTER_ITEM_DISTANCE,
            0,
            -ITEM_ANGLE
          );
        }
        // Right items position and angle
        else {
          setTransform(
            item,
            (i - index) * ITEM_DISTANCE + CENTER_ITEM_DISTANCE,
            0,
            ITEM_ANGLE
          );
        }
      }
    }
  }

  const handleControlClick = useCallback((e, buttonType) => {
    const button = e.target;
    button.style.transition = "0.1s all cubic-bezier(0.17, 0.75, 0.58, 0.95)";
    button.style.transform = "scale(0.9)";

    setTimeout(() => {
      button.style.transition =
        "0.15s all cubic-bezier(0.17, 0.75, 0.58, 0.95)";
      button.style.transform = "scale(1)";
    }, 100);

    // Simulate key events based on button type
    let key;
    if (buttonType === "play") {
      key = " ";
    } else if (buttonType === "rewind") {
      key = "a";
    } else if (buttonType === "skip") {
      key = "d";
    } else if (buttonType === "shuffle") {
      key = "r";
    }

    if (key) {
      const event = new KeyboardEvent("keydown", { key });
      document.dispatchEvent(event);
    }
  }, []);

  const handleExternalLinkClick = useCallback(
    (event) => {
      event.preventDefault();
      window.open(music[currentIndex].collectionViewUrl, "_blank");
    },
    [music, currentIndex]
  );

  // Handle arrow key presses
  const handleKeyDown = useCallback(
    (event) => {
      // Safe check for tagName
      if (
        event.target.tagName &&
        event.target.tagName.toLowerCase() === "input"
      ) {
        return;
      }

      if (event.key === "R" || event.key === "r") {
        handleRandomize();
      } else {
        setCurrentIndex((prevIndex) => {
          if (prevIndex == null) {
            return 0; // Starting index
          } else {
            if (
              ["ArrowRight", "ArrowUp", "D", "d", "W", "w"].includes(event.key)
            ) {
              // Increment index, ensure it doesn’t exceed array length
              target(Math.min(prevIndex + 1, music.length - 1));
              return Math.min(prevIndex + 1, music.length - 1);
            } else if (
              ["ArrowLeft", "ArrowDown", "A", "a", "S", "s"].includes(event.key)
            ) {
              // Decrement index, ensure it doesn’t go below 0
              target(Math.max(prevIndex - 1, 0));
              return Math.max(prevIndex - 1, 0);
            } else if (event.key === " " || event.key === "Enter") {
              target(
                prevIndex,
                music[prevIndex]._id,
                music[prevIndex].albumCover,
                searchTitle,
                music
              );
              return prevIndex;
            } else {
              return prevIndex;
            }
          }
        });
      }
    },
    [handleRandomize, music, setCurrentIndex, target]
  );

  // Attach event listener using useEffect
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="app">
      <div className="container">
        <Form className="searchBarRegion">
          <input
            className="musicListSearch"
            type="text"
            placeholder="Search..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearchTitle(e)}
          />
        </Form>
        <div className="genres">
          {genres.map((genre) => {
            return (
              <button
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className={
                  genre === selectedGenre ? "activeGenreButton" : "genreButton"
                }
              >
                {genre}
              </button>
            );
          })}
        </div>
        {music.length > 0 ? (
          <div className="coverflow" ref={el}>
            {music.map((song, index) => (
              <div
                className="coverflow-item"
                onClick={() =>
                  target(index, song._id, song.albumCover, searchTitle, music)
                }
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  className={`coverflow-image ${
                    index === hoveredIndex && index === currentIndex
                      ? "hover-brightness"
                      : ""
                  }`}
                  alt={song.trackName}
                  style={{ viewTransitionName: "image" + song._id }}
                  draggable="false"
                  src={song.albumCover}
                  key={index}
                />
                <img
                  className={
                    index === hoveredIndex && index === currentIndex
                      ? "coverflow-overlay"
                      : "coverflow-overlay-hide"
                  }
                  draggable="false"
                  src={playButton}
                  alt="Play Button"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="noResults">No Results</div>
        )}
        <div className="belowCoverflow">
          <div className="songInfo">
            {music[currentIndex] && (
              <div>
                <h3>{music[currentIndex].collectionCensoredName}</h3>
                <h5>{music[currentIndex].artistName}</h5>
              </div>
            )}
          </div>
          <div className="controls">
            <img
              src={shuffleButton}
              className="controlButton shuffleButton"
              draggable="false"
              onClick={(e) => handleControlClick(e, "shuffle")}
            />
            <img
              src={rewindButton}
              className="controlButton"
              draggable="false"
              onClick={(e) => handleControlClick(e, "rewind")}
            />
            <img
              src={playButton}
              className="controlButton playButton"
              draggable="false"
              onClick={(e) => handleControlClick(e, "play")}
            />
            <img
              src={skipButton}
              className="controlButton"
              draggable="false"
              onClick={(e) => handleControlClick(e, "skip")}
            />
            <img
              src={externalLinkButton}
              className="controlButton externalLinkButton"
              draggable="false"
              onClick={(e) => handleExternalLinkClick(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicList;
