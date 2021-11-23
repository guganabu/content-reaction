import axios from "axios";

const BASE_URL = "https://artful-iudex.herokuapp.com";

function getUsers() {
  return axios.get(`${BASE_URL}/users`);
}

export { getUsers };
