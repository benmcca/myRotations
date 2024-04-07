import React, { useState, useEffect } from "react";
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

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchArtist, setSearchArtist] = useState("");
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
        <Row>
          {music.map((song) => {
            return (
              <Col>
                <Card style={{ width: "18rem" }}>
                  <a
                    onClick={() => {
                      if (!document.startViewTransition) {
                        navigate(`/music/${song._id}`);
                      } else {
                        document.startViewTransition(() => {
                          flushSync(() => {
                            navigate(`/music/${song._id}`);
                          });
                        });
                      }
                    }}
                  >
                    <img
                      style={{
                        viewTransitionName: `${song._id}`,
                      }}
                      src={song.results[0].albumCover}
                      width="200"
                    />
                  </a>

                  <Card.Body>
                    <Card.Title>{song.results[0].trackName}</Card.Title>
                    <Card.Text>{song.results[0].artistName}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default MusicList;
