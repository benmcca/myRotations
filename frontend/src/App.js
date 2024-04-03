import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import SongsList from "./components/songsList";
import Song from "./components/song";
import AddComment from "./components/addComment";
import Login from "./components/login";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function App() {
  const [user, setUser] = useState(null)

  async function login(user = null) {
    setUser(user);
  }
  async function logout() {
    setUser(null);
  }
  
  return (
   <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">My Rotation</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
            <Nav.Link as={NavLink} to={"/songs"}>Songs</Nav.Link>
            <Nav.Link as={NavLink} to={user ? "" : "/login"}>{user ? "Logout" : "Login"}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default App;
