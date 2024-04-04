import React, {useState, useEffect} from 'react'
import MusicDataService from '../services/musicDataService'
import { Link, useParams } from 'react-router-dom'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const Movie = (user) => {

  const [song, setSong] = useState({
    id: null,
    title: "",
    comments:[]
  })
 let { id } = useParams();

 const getSong = id => {
  MusicDataService.get(id)
    .then(response => {
      setSong(response.data)
      console.log(response.data)
    })
    .catch(e => {
      console.log(e);
    })
}
  useEffect( () => {
    getSong(id)
      },[id])

  return (
    <div>
      <Container>
        <Row>
        {/* <Col>
          <Image src={song.results[0].albumCover} fluid />
        </Col> */}
        <Col>
          <Card>
            <Card.Header as="h5">{song._id}</Card.Header>
            {/* <Card.Body>
              <Card.Text>
               {song.results[0].artistName}
              </Card.Text>
              {user &&
              <Link to={"/music/" + id + "/comments"}>
              Add Comment
              </Link>}
            </Card.Body> */}
          </Card>
        </Col>
        </Row>
        </Container>
    </div>
  );
}

export default Movie;
