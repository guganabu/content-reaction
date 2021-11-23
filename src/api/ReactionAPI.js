import axios from "axios";

function getReactions() {
  return axios.get("https://artful-iudex.herokuapp.com/reactions");
}

function getUserContentReactions(params) {
  return axios.get(
    "https://artful-iudex.herokuapp.com/user_content_reactions",
    { params }
  );
}

function addUserContentReaction(params) {
  return axios.post(
    "https://artful-iudex.herokuapp.com/user_content_reactions",
    { params }
  );
}

function deleteUserContentReaction(_uContentReactionId) {
  return axios.delete(
    `https://artful-iudex.herokuapp.com/user_content_reactions/${_uContentReactionId}`
  );
}
export {
  getReactions,
  getUserContentReactions,
  addUserContentReaction,
  deleteUserContentReaction,
};
