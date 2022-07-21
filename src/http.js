import axios from "axios";

const $axios = axios.create({
  baseURL: 'http://localhost/api',
})

export default $axios
