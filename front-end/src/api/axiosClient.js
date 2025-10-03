import axios from 'axios';

//axios instance
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

//request interceptor to automatically attach token
axiosClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem('ACCESS_TOKEN');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//response interceptor to handle token expiration
axiosClient.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        const {response} = error;
        if(response && response.status === 401){
            // token expired/invalid , remove and redirect to login
            localStorage.removeItem('ACCESS_TOKEN');
        }
        return Promise.reject(error);
    }
);
export default axiosClient;