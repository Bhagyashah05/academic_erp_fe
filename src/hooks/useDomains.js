import axios from "axios";
export const fetchDomains = () => axios.get('http://localhost:8080/api/v1/domain');
