import axios from 'axios';

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
    return Promise.reject(error); 
  }
);

export const fetchDomains = () => api.get('/domain');
export const createDomain = (data) => api.post('/domain', data);
export const editDomain = (id, data) => api.put(`/domain/${id}`, data);
export const fetchStudentsByDomain = (id) => api.get(`/student/getstudentsbydomain/${id}`);
export const login = (loginData) => api.post('/auth/admin/login', loginData);

