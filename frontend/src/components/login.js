import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import Cookies from "js-cookie";

function Login({ loginSetter }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  let songId, imageURL, imageId, imageIndex, searchValue, music;
  if (location && location.state) {
    songId = location.state.songId;
    imageURL = location.state.imageURL;
    imageId = location.state.imageId;
    imageIndex = location.state.imageIndex;
    searchValue = location.state.searchValue;
    music = location.state.music;
  }

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const onChangeId = (e) => {
    const id = e.target.value;
    setId(id);
  };

  const handleNewUser = () => {
    setNewUser(true);
  };

  const handleSubmit = () => {
    if (name !== "" && id !== "") {
      setUser({ name: name, id: id });
      loginSetter({ name: name, id: id });

      const currentDate = new Date();
      const expirationTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate()
      );
      Cookies.set("auth", JSON.stringify({ name: name, id: id }), {
        expires: expirationTime,
      });
    }
  };

  return (
    <div className="centered">
      {user == null ? (
        <div className="loginSection">
          {location && location.state ? (
            <img
              className="back-icon"
              alt="backButton"
              src="https://cdn-icons-png.flaticon.com/512/32/32213.png"
              onClick={() => {
                if (typeof document.startViewTransition === "function") {
                  document.startViewTransition(() => {
                    flushSync(() => {
                      navigate(`/music/${songId}`, {
                        state: {
                          imageURL: imageURL,
                          imageId: imageId,
                          imageIndex: imageIndex,
                          searchValue: searchValue,
                          music: music,
                        },
                      });
                    });
                  });
                } else {
                  navigate(`/music/${songId}`, {
                    state: {
                      imageURL: imageURL,
                      imageId: imageId,
                      imageIndex: imageIndex,
                      searchValue: searchValue,
                      music: music,
                    },
                  });
                }
              }}
            />
          ) : (
            <img
              className="back-icon"
              alt="backButton"
              src="https://cdn-icons-png.flaticon.com/512/32/32213.png"
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
            />
          )}
          <h3>{newUser ? "Sign Up" : "Login"}</h3>
          <input
            type="text"
            placeholder="Display Name"
            value={name}
            onChange={onChangeName}
          />
          <input
            type="password"
            placeholder="Password"
            value={id}
            onChange={onChangeId}
          />
          <div className="loginActions">
            {!newUser && (
              <div className="signup" onClick={handleNewUser}>
                Don't have an account? Sign Up
              </div>
            )}
            <div className="loginButton">
              <button onClick={handleSubmit}>
                {newUser ? "Sign Up" : "Login"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="centered">
          <div className="addCommentResponse">
            <h5>{name} logged in successful.</h5>
            {location && location.state ? (
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
            ) : (
              <Link to="/music">Back to Music</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default Login;
