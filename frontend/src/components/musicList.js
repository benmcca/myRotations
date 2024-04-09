import React, { useState, useEffect, useRef } from "react";
import MusicDataService from "../services/musicDataService";
import { Link, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import musicDataService from "../services/musicDataService";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

import "./style.css";

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchArtist, setSearchArtist] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeUser, setActiveUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveMusic();
  }, []);

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

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };
  useEffect(() => {
    findByTitle(); // only call the search once searchTitle state is fully updated
  }, [searchTitle]);

  const onChangeSearchArtist = (e) => {
    const searchArtist = e.target.value;
    setSearchArtist(searchArtist);
  };
  useEffect(() => {
    findByArtist(); // only call the search once searchArtist state is fully updated
  }, [searchArtist]);

  const find = (query, by) => {
    MusicDataService.find(query, by)
      .then((response) => {
        setMusic(response.data.songs);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const findByTitle = () => {
    find(searchTitle, "trackName");
  };

  const findByArtist = () => {
    find(searchArtist, "artistName");
  };

  const ITEM_DISTANCE = 200;
  const ITEM_ANGLE = -45;
  const CENTER_ITEM_POP = 500;
  const CENTER_ITEM_DISTANCE = 80;

  const el = useRef(null);

  // Help function to set element style transform property
  function setTransform(el, xpos, zpos, yAngle) {
    el.style.transform = `translateX(${xpos}px) translateZ(${zpos}px) rotateY(${yAngle}deg)`;
  }

  useEffect(() => {
    target(Math.floor(0));
    // target(Math.floor(music.length * 0.5));
  }, [music]);

  function target(index, _id) {
    if (el.current) {
      if (index == currentIndex && activeUser) {
        document.startViewTransition(() => {
          flushSync(() => {
            console.log(`going to /music/${_id}`);
            navigate(`/music/${_id}`);
          });
        });
      } else {
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

  const handleMouseEnter = () => {
    setActiveUser(true);
  };

  return (
    <div className="App">
      <Container>
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search"
                  value={searchTitle}
                  onChange={onChangeSearchTitle}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Artist"
                  value={searchArtist}
                  onChange={onChangeSearchArtist}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <div className="coverflow" ref={el}>
          {music.map((song, index) => (
            <img
              key={index}
              src={song.albumCover}
              width="300"
              height="300"
              onClick={() => target(index, song._id)}
              onMouseEnter={() => handleMouseEnter()}
              className="coverflow-item"
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default MusicList;
