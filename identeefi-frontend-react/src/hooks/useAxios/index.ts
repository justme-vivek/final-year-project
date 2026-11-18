import axios from 'axios'
import {  SERVER_URL } from '../../constants/application'

export default () => {
  const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    timeout: 100000,
  })

  return axiosInstance
}
