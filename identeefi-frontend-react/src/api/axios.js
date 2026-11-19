import { API_BASE } from '../config';
import axios from 'axios';

export default axios.create({
    baseURL: API_BASE
});