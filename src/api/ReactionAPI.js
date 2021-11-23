import axios from "axios";

const BASE_URL = "https://artful-iudex.herokuapp.com";

function getReactions() {
  return axios.get(`${BASE_URL}/reactions`);
}

function getUserContentReactions(params) {
  return axios.get(`${BASE_URL}/user_content_reactions`, { params });
}

function addUserContentReaction(params) {
  return axios.post(`${BASE_URL}/user_content_reactions`, { params });
}

function deleteUserContentReaction(contentReactionId) {
  return axios.delete(
    `${BASE_URL}/user_content_reactions/${contentReactionId}`
  );
}
export {
  getReactions,
  getUserContentReactions,
  addUserContentReaction,
  deleteUserContentReaction,
};
