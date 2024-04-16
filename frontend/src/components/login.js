// Benjamin McCabe
// 4/12/24
// IT302 - 002
// Phase 5 Project
// bsm25@njit.edu

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Login({ loginSetter }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [user, setUser] = useState(null);
  const location = useLocation();

  let songId, imageURL, imageId, imageIndex, searchValue, music;
  if (location && location.state) {
    songId = location.state.songId;
    imageURL = location.state.imageURL;
    imageId = location.state.imageId;
    imageIndex = location.state.imageIndex;
    searchValue = location.state.searchValue;
    music = location.state.music;
  }
  useEffect(() => {
    loginSetter(user);
  }, [loginSetter, user]);

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
  };
  const onChangeId = (e) => {
    const id = e.target.value;
    setId(id);
  };
  const handleSubmit = () => {
    setUser({ name: name, id: id });
  };
  return (
    <div>
      {user == null ? (
        <Form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={name}
              onChange={onChangeName}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter id"
              value={id}
              onChange={onChangeId}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      ) : (
        <p>
          {name} ({id}) logged in successful.
          {location && location.state && (
            <Link
              to={"/music/" + songId}
              state={{
                imageURL: imageURL,
                imageId: imageId,
                imageIndex: imageIndex,
                searchValue: searchValue,
                music: music,
              }}
            >
              Back to Song
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
export default Login;
