import React, { useState, useEffect } from 'react'
import MusicDataService from "../services/musicDataService"
import { Link } from "react-router-dom"
import musicDataService from '../services/musicDataService';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchArtist, setSearchArtist] = useState("");
  useEffect(() => {
    retrieveMusic();
  }, []);


  const retrieveMusic = () => {
    musicDataService.getAll()
      .then((response) => {
        console.log(response.data);
        setMusic(response.data.songs);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value
    setSearchTitle(searchTitle);
  };

  const onChangeSearchArtist = (e) => {
    const searchArtist = e.target.value;
    setSearchArtist(searchArtist);
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
              <Button
                variant="primary"
                type="button"
                onClick={null}
              >
                Search Songs
              </Button>
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
              <Button
                variant="primary"
                type="button"
                onClick={null}
              >
                Search Artist
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          {music.map((song) => {
            console.log(song)
            return (
              <Col>
                <Card style={{ width: '18rem' }}>
                  <Card.Img src={song.results[0].albumCover} />
                  <Card.Body>
                    <Card.Title>{song.results[0].trackName}</Card.Title>
                    <Card.Text>{song.results[0].artistName}</Card.Text>
                    <Card.Text>{song.results[0].collectionName}</Card.Text>
                    <Card.Text>{new Date(Date.parse(song.results[0].releaseDate)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Card.Text>
                    <Link to={"/music/id/" + song._id} >Comments</Link>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Container>
    </div>
  );
}

export default MusicList;