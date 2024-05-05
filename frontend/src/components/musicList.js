import React, { useState, useEffect, useRef } from "react";
import MusicDataService from "../services/musicDataService";
import { useNavigate, useLocation } from "react-router-dom";
import { flushSync } from "react-dom";
import musicDataService from "../services/musicDataService";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

import "./style.css";

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [goToIndex, setGoToIndex] = useState(null);
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
        }
      } else {
        retrieveMusic();
      }
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

  const handleSearchTitle = (e) => {
    e.preventDefault(); // stop form from reloading page
    findByTitle();
  };

  const findByTitle = (searchValue) => {
    if (searchValue) {
      find(searchValue, "any");
    } else {
      find(searchTitle, "any");
    }
  };

  const find = (query, by) => {
    setMusic([]);
    setGoToIndex(0);
    MusicDataService.find(query, by)
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
    find("", "any");
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

  // Handle arrow key presses
  const handleKeyDown = (event) => {
    if (event.target.tagName.toLowerCase() === "input") {
      return;
    }
    if (event.key === "R" || event.key === "r") {
      handleRandomize();
    } else {
      setCurrentIndex((prevIndex) => {
        if (prevIndex == null) {
          console.log("null");
          return 0; // Starting index
        } else {
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            // Increment index, but ensure it doesn't exceed the length of results
            target(Math.min(prevIndex + 1, 29));
            return Math.min(prevIndex + 1, 29);
          } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            // Decrement index, but ensure it doesn't go below 0
            target(Math.max(prevIndex - 1, 0));
            return Math.max(prevIndex - 1, 0);
          } else {
            // For other keys, return the current index
            return prevIndex;
          }
        }
      });
    }
  };

  return (
    <div className="app">
      <div>
        <Container>
          <Form>
            <button onClick={handleRandomize}>
              <img
                className="dice-icon"
                alt="Randomize"
                src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/dice.png"
              />
            </button>
            <input
              className="musicListSearch"
              type="text"
              placeholder="Search..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchTitle(e)}
            />
          </Form>

          {music.length > 0 ? (
            <div className="coverflow" ref={el}>
              {music.map((song, index) => (
                <img
                  className="coverflow-item"
                  alt={song.trackName}
                  style={{ viewTransitionName: "image" + song._id }}
                  src={song.albumCover}
                  key={index}
                  onClick={() =>
                    target(index, song._id, song.albumCover, searchTitle, music)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="noResults">No Results</div>
          )}
          {music[currentIndex] && (
            <div className="songInfo">
              <div>
                <h3>{music[currentIndex].collectionCensoredName}</h3>
                <h6>{music[currentIndex].artistName}</h6>
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default MusicList;
