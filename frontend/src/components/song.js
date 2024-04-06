import React, { useState, useEffect } from "react";
import MusicDataService from "../services/musicDataService";
import { Link, useParams } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const Song = (user) => {
  const [song, setSong] = useState({
    id: null,
    title: "",
    comments: [],
    results: [],
  });
  let { id } = useParams();

  useEffect(() => {
    const getSong = async () => {
      try {
        const response = await MusicDataService.get(id);
        setSong(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSong();
  }, [id]);

  // Wait for song to be loaded
  if (!song.results.length) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <img
            src={song.results[0].albumCover}
            style={{
              borderRadius: "5px",
              viewTransitionName: `${song._id}`,
              contain: "paint",
            }}
          />
        </Col>
        <Col>
          <Card>
            <Card.Header as="h5">{song.results[0].collectionName}</Card.Header>
            <Card.Body>
              <Card.Title as="h6">{song.results[0].trackName}</Card.Title>
              <audio controls>
                <source src={song.results[0].previewUrl} type="audio/mp4" />
                Your browser does not support the audio element.
              </audio>
              <Card.Text>{song.results[0].artistName}</Card.Text>
              <Card.Text>{song.results[0].collectionName}</Card.Text>
              <Card.Text>
                {new Date(
                  Date.parse(song.results[0].releaseDate)
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Card.Text>
              {user && (
                <Link to={"/music/" + id + "/comments"}>Add Comment</Link>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Song;
