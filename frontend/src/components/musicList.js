import React, { useState, useEffect } from "react";
import MusicDataService from "../services/musicDataService";
import { Link } from "react-router-dom";
import musicDataService from "../services/musicDataService";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

import { motion } from "framer-motion";

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchArtist, setSearchArtist] = useState("");

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
        console.log(response.data);
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

  return (
    <motion.div
      className="App"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
        <Row>
          {music.map((song) => {
            return (
              <Col>
                <Card style={{ width: "18rem" }}>
                  <a href={"/music/" + song._id}>
                    <Card.Img src={song.results[0].albumCover} />
                  </a>
                  <Card.Body>
                    <Card.Title>{song.results[0].trackName}</Card.Title>
                    <Link to={"/music/" + song._id}>Comments</Link>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </motion.div>
  );
};

export default MusicList;
