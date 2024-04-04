import React, { useState, useEffect } from 'react'
import MusicDataService from "../services/musicDataService"
import { Link } from "react-router-dom"
import musicDataService from '../services/musicDataService';

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchArtist, setSearchArtist] = useState("");
  useEffect(() => {
    retrieveMusic();
  }, []);


  const retrieveMusic = () => {
    musicDataService.getAll()
      .then((response) => {
        console.log(response.data);
        setMusic(response.data.music);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value
    setSearchTitle(searchTitle);
  };

  const onChangeSearchArtist = (e) => {
    const searchArtist = e.target.value;
    setSearchArtist(searchArtist);
  };

    return (
        <div className="App">
            Music List
        </div>
    );
}

export default MusicList;