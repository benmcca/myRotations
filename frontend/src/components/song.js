import React, { useState, useEffect } from "react";
import MusicDataService from "../services/musicDataService";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { flushSync } from "react-dom";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import "./style.css";

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
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log("useEffect");
    getSong(id);
  }, [id]);

  const location = useLocation();
  const imageURL = location.state.imageURL;
  const imageId = location.state.imageId;

  return (
    <div className="songPage">
      <Row>
        <Col>
          <img
            src={imageURL}
            style={{
              viewTransitionName: "image" + imageId,
              borderRadius: "10px",
            }}
            width="700"
            height="700"
            className="songPageImage"
          />
          {console.log(`image ${song._id}`)}
        </Col>
        <Col>
          <Card>
            <Card.Header as="h5">
              {song.collectionName + " by " + song.artistName}
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
            </Card.Header>
            <Card.Body>
              {songPreview && (
                <>
                  <audio controls>
                    <source src={songPreview} type="audio/mp4" />
                    Your browser does not support the audio element.
                  </audio>
                </>
              )}
              <Card.Title as="h6">{song.trackName}</Card.Title>
              
              {user && (
                <Link to={"/music/" + id + "/comments"}>Add Comment</Link>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Song;
