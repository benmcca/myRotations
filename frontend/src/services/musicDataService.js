import axios from "axios";

class MusicDataService {
  getAll(page = 0) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/bsm25/music?page=${page}`
    );
  }

  get(id) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/bsm25/music/${id}`
    );
  }

  find(query, by = "trackName", page = 0) {
    return axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/bsm25/music?${by}=${query}&page=${page}`
    );
  }

  createComment(data) {
    return axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/bsm25/music/comments`,
      data
    );
  }

  updateComment(data) {
    return axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/bsm25/music/comments`,
      data
    );
  }

  deleteReview(id, userId) {
    return axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/bsm25/music/comments`,
      { data: { commentId: id, userId: userId } }
    );
  }
}
export default new MusicDataService();
