import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";

import MusicList from "./musicList";
import Song from "./song";
import AddComment from "./addComment";
import Login from "./login";

import { AnimatePresence } from "framer-motion";

function AnimatedRoutes({ user, login }) {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MusicList />}></Route>
        <Route path="/music" element={<MusicList />}></Route>
        <Route path="/music/:id/" element={<Song user={user} />}></Route>
        <Route
          path="/music/:id/comment"
          element={<AddComment user={user} />}
        ></Route>
        <Route path="/login" element={<Login login={login} />}></Route>
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
