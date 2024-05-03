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
        const sortedSongs = response.data.songs.sort((a, b) => {
          // Convert releaseDate strings to Date objects
          const dateA = new Date(a.releaseDate);
          const dateB = new Date(b.releaseDate);

          // Compare dates
          return dateA - dateB;
        });

        setMusic(sortedSongs);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleRandomize = async (e) => {
    e.preventDefault();
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
        // bring selected song to the center
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
