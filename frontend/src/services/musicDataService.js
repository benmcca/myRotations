import axios from "axios";

class MusicDataService {
  getAll(page = 0) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/v1/bsm25/music?page=${page}`
    );
  }

  get(id) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/v1/bsm25/music/id/${id}`
    );
  }

  find(query, by = "any", genre = null, page = 0) {
    let url = `${
      process.env.REACT_APP_BACKEND_URL
    }api/v1/bsm25/music?${by}=${encodeURIComponent(query)}&page=${page}`;

    if (genre) {
      url += `&genre=${encodeURIComponent(genre)}`;
    }
    return axios.get(url);
  }

  getGenres() {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}api/v1/bsm25/music/genres`
    );
  }

  createComment(data) {
    return axios.post(
      `${process.env.REACT_APP_BACKEND_URL}api/v1/bsm25/music/comments`,
      data
    );
  }

  updateComment(data) {
    return axios.put(
      `${process.env.REACT_APP_BACKEND_URL}api/v1/bsm25/music/comments`,
      data
    );
  }

  deleteComment(id, userId) {
    return axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}api/v1/bsm25/music/comments`,
      { data: { commentId: id, userId: userId } }
    );
  }
}
export default new MusicDataService();
