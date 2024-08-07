import axios from "axios";

const client = axios.create({
  // baseURL: "http://localhost:1111",
  baseURL: "http://192.168.21.56:1111",
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

export default client;