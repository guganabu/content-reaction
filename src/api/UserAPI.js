import axios from "axios";

function getUsers() {
  return axios.get("https://artful-iudex.herokuapp.com/users");
}

export { getUsers };
