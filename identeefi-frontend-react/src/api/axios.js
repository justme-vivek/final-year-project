import { API_BASE } from '../config';
import axios from 'axios';
import attach from './authHeader';

const instance = axios.create({
    baseURL: API_BASE
});
attach(instance);
export default instance;