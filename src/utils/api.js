import axios from 'axios';
import { toast,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

api.interceptors.request.use(
  (config) => {
    if (config.url !== '/auth/admin/login') {
      const user = JSON.parse(localStorage.getItem('user')); 
      if (user && user.jwt) {
        config.headers.Authorization = `Bearer ${user.jwt}`;
      }
    }
    return config;
  },
  (error) => {
    console.log("errorrrrrrrrrrrrrrrrrrrrr")
    return Promise.reject(error); 
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error)
    if (error.response.data.message==="JWT expired" && error.response.status === 401) {
      toast.error('Your session has expired. Please log in again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        closeButton:false
        });
      // setTimeout(() => {
        localStorage.removeItem('user'); 
        window.location.href = '/'; 
      // }, 2000); 
    }
    // else if(error)
    // else if (error.response) {
    //   toast.error(error.response.data.message || 'Something went wrong!',
    //     {
    //       closeButton:false
    //     }
    //   );
    return Promise.reject(error); 
    // }
  }
);

export const startTokenExpiryCheck = () => {
  console.log("enterrrrrrrrrrrrrrr")
  const user = JSON.parse(localStorage.getItem('user'));
  const checkInterval = 1000; 
  console.log(user);
  const exptime=user.expiration;
  const intervalId = setInterval(() => {
    const currentTime = Date.now();
    console.log(exptime);
    if (exptime <= currentTime) {
      toast.error('Your session has expired. Please log in again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        closeButton:false
        });
        // setTimeout(() => {
        //   console.log('This runs after 5 seconds');
        // }, 5000);
      localStorage.removeItem('user');
      window.location.href = '/'; 
      clearInterval(intervalId);
    }
  }, checkInterval);
};

export const fetchDomains = () => api.get('/domain');
export const createDomain = (data) => api.post('/domain', data);
export const editDomain = (id, data) => api.put(`/domain/${id}`, data);
export const fetchStudentsByDomain = (id) => api.get(`/student/getstudentsbydomain/${id}`);
export const login = (loginData) => api.post('/auth/admin/login', loginData);

