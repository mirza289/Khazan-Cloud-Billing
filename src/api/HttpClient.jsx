import axios from 'axios'

// for development locally the base url is localhost
// for production using nginx proxy_pass the base url is /api
// const baseURL = process.env.REACT_APP_ENV === 'dev' ? +'http://103.164.9.58:5000' : '/'

const HttpClient = axios.create({
  baseURL: "http://127.0.0.1:5000",
  // withCredentials: true,
  headers: {
    // 'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH'
    }
});

export default HttpClient;