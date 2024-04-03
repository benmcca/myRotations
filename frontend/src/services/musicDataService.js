import axios from "axios";

class MusicDataService {


    getAll(page = 0) {
      return axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/music?page=${page}`
      );
    }

    get(id) {
      return axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/music/id/${id}`
      );
    }

    find(query, by = "trackName", page = 0) {
        return axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/movies?${by}=${query}&page=${page}`
        );
    }
    
    createComment(data) {
        return axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/music/comments`, data)
    }

    updateComment(data) {
    return axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/music/comments`, data)
    }

    deleteReview(id, userId) {
        return axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/music/comments`,
          { data: { commentId: id, userId: userId } }
        )
      }
    
    getRatings() {
    return axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/movies/ratings`)

    }
}
export default new MusicDataService();
    
    
  