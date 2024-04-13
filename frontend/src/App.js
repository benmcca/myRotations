// Benjamin McCabe
// 4/12/24
// IT302 - 002
// Phase 4 Project
// bsm25@njit.edu

import React, { useState, useCallback } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import MusicList from "./components/musicList";
import Song from "./components/song";
import AddComment from "./components/addComment";
import Login from "./components/login";
import "./App.css";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function login(user = null) {
    setUser(user);
  }
  async function logout() {
    setUser(null);
  }

  const loginSetter = useCallback(
    (user) => {
      setUser(user);
    },
    [setUser]
  );

  return (
    <div className="App">
      <Navbar
        bg="light"
        expand="lg"
        className="Navbar"
        style={{ paddingLeft: "20px" }}
      >
        <Navbar.Brand
          onClick={() => {
            if (!document.startViewTransition) {
              navigate(`/music`);
            } else {
              document.startViewTransition(() => {
                flushSync(() => {
                  navigate(`/music`);
                });
              });
            }
          }}
        >
          My Rotation
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to={user ? "" : "/login"}>
              {user ? "Logout" : "Login"}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<MusicList />}></Route>
        <Route path="/music" element={<MusicList />}></Route>
        <Route path="/music/:id/" element={<Song user={user} />}></Route>
        <Route
          path="/music/:id/comment"
          element={<AddComment user={user} />}
        ></Route>
        <Route
          path="/login"
          element={<Login user={user} loginSetter={loginSetter} />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
