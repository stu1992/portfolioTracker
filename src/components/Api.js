import axios from 'axios';

const attributes = {
  credentials: 'include',
  mode: "cors",
  headers: {
    'Content-Type': 'application/json',
     'Access-Control-Allow-Origin': '*'
  }
};
export default axios.create({
  baseURL: "http://localhost:3000/api/"
});
