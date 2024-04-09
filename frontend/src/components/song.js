import React, { useState, useEffect } from "react";
import MusicDataService from "../services/musicDataService";
import { Link, useParams, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const Song = ({ user }) => {
  const [song, setSong] = useState({
    id: null,
    title: "",
    comments: [],
  });
  const [songPreview, setSongPreview] = useState(null);
  let { id } = useParams();
  const navigate = useNavigate();

  const getSong = (id) => {
    MusicDataService.get(id)
      .then((response) => {
        setSong(response.data);
        setSongPreview(response.data.previewUrl);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log("useEffect");
    getSong(id);
  }, [id]);

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <img
              style={{
                viewTransitionName: `${song._id}`,
              }}
              onClick={() => {
                document.startViewTransition(() => {
                  flushSync(() => {
                    console.log("going to /music");
                    navigate(`/music`);
                  });
                });
              }}
              src={song.albumCover}
              width="600"
              height="600"
            />
            {console.log(`image ${song._id}`)}
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">{song.collectionName}</Card.Header>
              <Card.Body>
                <Card.Title as="h6">{song.trackName}</Card.Title>
                {songPreview && (
                  <>
                    <audio controls>
                      <source src={songPreview} type="audio/mp4" />
                      Your browser does not support the audio element.
                    </audio>
                    <Card.Text>{songPreview}</Card.Text>
                  </>
                )}
                <Card.Text>{song.artistName}</Card.Text>
                <Card.Text>{song.collectionName}</Card.Text>
                <Card.Text>{song._id}</Card.Text>
                <Card.Text>
                  {new Date(Date.parse(song.releaseDate)).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </Card.Text>
                {user && (
                  <Link to={"/music/" + id + "/comments"}>Add Comment</Link>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Song;
