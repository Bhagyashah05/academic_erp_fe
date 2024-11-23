import axios from 'axios';

export const fetchDomains = () => axios.get('http://localhost:8080/api/v1/domain');
export const createDomain = (data) => axios.post('http://localhost:8080/api/v1/domain', data);
export const editDomain = (id, data) => axios.put(`http://localhost:8080/api/v1/domain/${id}`, data);
export const fetchStudentsByDomain = (id) =>
  axios.get(`http://localhost:8080/api/v1/student/getstudentsbydomain/${id}`);
