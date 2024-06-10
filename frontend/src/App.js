import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import Cookies from "js-cookie";

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
  const isAuthenticated = !!Cookies.get("auth");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && isAuthenticated) {
      setUser(JSON.parse(Cookies.get("auth")));
    }
  }, [user, isAuthenticated]);

  const loginSetter = (user) => {
    setUser(user);
  };

  async function logout() {
    setUser(null);
    Cookies.remove("auth");
  }

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
            if (typeof document.startViewTransition === "function") {
              document.startViewTransition(() => {
                flushSync(() => {
                  navigate(`/music`);
                });
              });
            } else {
              navigate(`/music`);
            }
          }}
        >
          myRotations
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link
              as={NavLink}
              to={user ? "" : "/login"}
              onClick={user ? logout : null}
            >
              {user ? "Logout" : "Login"}
            </Nav.Link>
            <Nav.Link
              href="https://benmcca.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              About Me
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
