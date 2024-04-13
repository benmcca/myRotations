// Benjamin McCabe
// 4/12/24
// IT302 - 002
// Phase 4 Project
// bsm25@njit.ed

import React, { useState, useEffect, useRef } from "react";
import MusicDataService from "../services/musicDataService";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
        await setSearchTitle(location.state.searchValue);
        if (location.state.searchValue != "") {
          await findByTitle(location.state.searchValue);
        } else {
          await retrieveMusic();
        }
        setGoToIndex(location.state.goToIndex);
      } else {
        await retrieveMusic();
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
        setMusic(response.data.songs);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const ITEM_DISTANCE = 200;
  const ITEM_ANGLE = -45;
  const CENTER_ITEM_POP = 500;
  const CENTER_ITEM_DISTANCE = 80;
  function setTransform(el, xpos, zpos, yAngle) {
    el.style.transform = `translateX(${xpos}px) translateZ(${zpos}px) rotateY(${yAngle}deg)`;
  }
  function target(index = 0, _id, albumCover, searchValue) {
    if (el.current) {
      // if clicked on an item and it is in the currentIndex, take user to songPage
      if (index === currentIndex && _id) {
        document.startViewTransition(() => {
          flushSync(() => {
            navigate(`/music/${_id}`, {
              state: {
                imageId: _id,
                imageURL: albumCover,
                imageIndex: index,
                searchValue: searchValue,
              },
            });
          });
        });
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
            <button onClick={handleSearchTitle}>
              <img
                src="https://cdn1.iconfinder.com/data/icons/pointed-edge-web-navigation/117/search-grey-512.png"
                alt="Search"
                className="search-icon"
              />
            </button>
            <input
              type="text"
              placeholder="Search..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchTitle(e)}
            />
          </Form>

          <div className="coverflow" ref={el}>
            {music.map((song, index) => (
              <img
                onClick={() =>
                  target(index, song._id, song.albumCover, searchTitle)
                }
                key={index}
                alt={song.trackName}
                src={song.albumCover}
                className="coverflow-item"
                style={{ viewTransitionName: "image" + song._id }}
              />
            ))}
          </div>
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
