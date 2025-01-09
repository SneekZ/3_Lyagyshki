import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: "http://192.168.0.67:52912",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default axiosInstance;