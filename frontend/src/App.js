import React, { useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import AnimatedRoutes from "./components/animatedRoutes";

function App() {
  const [user, setUser] = useState(null);

  async function login(user = null) {
    setUser(user);
  }
  async function logout() {
    setUser(null);
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={NavLink} to={"/"}>
          My Rotation
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {/* <Nav.Link as={NavLink} to={"/music"}>
              Songs
            </Nav.Link> */}
            <Nav.Link as={NavLink} to={user ? "" : "/login"}>
              {user ? "Logout" : "Login"}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <AnimatedRoutes user={user} login={login} />
    </div>
  );
}

export default App;
