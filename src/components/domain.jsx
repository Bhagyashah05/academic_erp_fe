import React, { useState, useEffect, useContext } from 'react';
import  {createDomain, editDomain, fetchDomains}  from '../utils/api';
import { fetchStudentsByDomain } from '../utils/api';
// import axios from 'axios';
import { ToastContainer, toast ,Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startTokenExpiryCheck } from '../utils/api';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Pagination,
  TableHead,
  TableRow,
  Paper,
  Button,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Modal,
  TextField,
  Box,
  TablePagination,
} from '@mui/material';
import { UserContext } from '../UserContext';
import NavBar from './NavBar';
// import { ToastContainer } from 'react-toastify';

const DomainList = () => {
  const { setUser } = useContext(UserContext); 
  const [domains, setDomains] = useState([]);
  const [filteredDomains, setFilteredDomains] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newDomain, setNewDomain] = useState({
    program: '',
    batch: '',
    capacity: '',
    qualification: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDomain, setCurrentDomain] = useState(null);

  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [students, setStudents] = useState([]); 
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  useEffect( () => {
    const response=async()=>{
      try{
        const data =await fetchDomains();
        console.log(data);
        setDomains(data.data);
        setFilteredDomains(data.data);

      const uniqueYears = [
          ...new Set(data.data.map((domain) => domain.batch)),
        ].sort();
        setYears(uniqueYears);
        setLoading(false);

      }
      catch(err){
        console.log("error fetching domains");
      }
      
    }
    response();
    setTimeout(startTokenExpiryCheck,1000);
    
  }, []);
  const uniqueDomains = [
    ...new Set(domains.map((domain) => domain.program?.toUpperCase()))
  ].filter(Boolean);

  const handleDomainFilterChange = (event) => {
    const value = event.target.value;
    setSelectedDomain(value);
    applyFilters(value, selectedYear);
  };

  const handleYearFilterChange = (event) => {
    const value = event.target.value;
    setSelectedYear(value);
    applyFilters(selectedDomain, value);
  };

  const applyFilters = (domainFilter, yearFilter) => {
    const filtered = domains.filter((domain) => {
      const matchesDomain =
        !domainFilter || domain.program.toUpperCase() === domainFilter;
      const matchesYear = !yearFilter || domain.batch === yearFilter;
      return matchesDomain && matchesYear;
    });
    setFilteredDomains(filtered);
    setPage(0);
  };

  const handleShowStudents = async (domainId) => {
    try {
      const response = await fetchStudentsByDomain(domainId);
      console.log(response.data);
      setStudents(response.data);
      setShowStudentsModal(true);
    } catch (err) {
      setError('Error fetching students');
    }
  };

  const handleCreateClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setShowStudentsModal(false); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDomain((prevDomain) => ({
      ...prevDomain,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentDomain((prevDomain) => ({
      ...prevDomain,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const domainToSubmit = {
      ...newDomain,
      capacity: parseInt(newDomain.capacity, 10)
    };

    try {
      
      const response= await createDomain(domainToSubmit)
      setDomains([...domains, response.data]);
      setShowModal(false);
      setNewDomain({ program: '', batch: '', capacity: '', qualification: '' });
      window.location.reload(); 

      toast.success('Domain Created Successfully!', {
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
    } catch (err) {

      toast.error('Domain Creation Failed', {
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
      // setError('Error creating domain');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const domainToEdit = {
      ...currentDomain,
      capacity: parseInt(currentDomain.capacity, 10)
    };

    try {
      await editDomain(domainToEdit.domainId,domainToEdit)
      setFilteredDomains((prevDomain) =>
        prevDomain.map((domains) => (domains.domainId === domainToEdit.domainId ? domainToEdit : domains))
      );


      setShowEditModal(false);

      toast.success('Domain Edited Successfully!', {
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
      
    } catch (err) {
      // setError('Error editing domain');
      toast.error('Domain Not Edited!', {
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
    }
  };

  const handleEdit = (domain) => {
    setCurrentDomain(domain);
    setShowEditModal(true);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const paginatedDomains = filteredDomains.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxWidth: '90%',  
    width: 'auto',    
    height: 'auto',   
  };

  const imageStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
  };
  const placeholderImage =
  'https://via.placeholder.com/50?text=No+Image';

  const getImageUrl = (path) => {
    if (path?.includes('drive.google.com')) {
      const fileId = path.split('/d/')[1]?.split('/')[0];
      console.log(fileId)
      console.log('https://drive.google.com/thumbnail?sz=w640&id='+fileId)
      return `https://drive.google.com/thumbnail?sz=w640&id=${fileId}`;
    }
    return path || placeholderImage;
  };

  return (
    <>
    <ToastContainer/>
    {loading?(<div>loading.....</div>):(


    <div style={{ backgroundColor: 'lightyellow' }}>
      <NavBar />
      <h1 style={{ textAlign: 'center' }}>Domain List</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleCreateClick} sx={{background: "rgb(15,139,213)",
background: "linear-gradient(90deg, rgba(15,139,213,1) 35%, rgba(0,255,222,1) 100%)"}}>
          Create Domain
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px' }}>
      <FormControl sx={{ width: 200 }}>
      <InputLabel id="domain-filter-label">Domain</InputLabel>
      <Select
        labelId="domain-filter-label"
        value={selectedDomain}
        onChange={handleDomainFilterChange}
      >
        <MenuItem value="">All</MenuItem>
        {uniqueDomains.map((domain) => (
          <MenuItem key={domain} value={domain}>
            {domain}
          </MenuItem>
        ))}
      </Select>
    </FormControl>


        <FormControl sx={{ width: 200 }}>
          <InputLabel id="year-filter-label">Year</InputLabel>
          <Select
            labelId="year-filter-label"
            value={selectedYear}
            onChange={handleYearFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div style={{margin:"50px"}}>
      <TableContainer component={Paper} sx={{ 
        // background: "rgb(255,255,255)",
// background: "linear-gradient(115deg, rgba(255,255,255,1) 0%, rgba(5,5,10,1) 54%)" 
background:"white"
}}>
        <Table>
          <TableHead sx={{ backgroundColor: '#0288ff ', color: '#fff' }}>
          <TableRow>
          <TableCell>Domain Name</TableCell>
          <TableCell>Batch</TableCell>
          <TableCell>Capacity</TableCell>
          <TableCell>Qualification</TableCell>
          <TableCell style={{ textAlign: "center" }}>Actions</TableCell>
        </TableRow>

          </TableHead>
          <TableBody>
            {paginatedDomains.map((domain) => (
              <TableRow key={domain.id}>
                <TableCell>{domain.program ? domain.program.toUpperCase() : 'Not Available'}</TableCell>
                <TableCell>{domain.batch || 'Not Available'}</TableCell>
                <TableCell>{domain.capacity}</TableCell>
                <TableCell>{domain.qualification ? domain.qualification.toUpperCase() : 'Not Available'}</TableCell>
                <TableCell>
                  <div style={{display:"flex"}}>
                  <Button variant="outlined" onClick={() => handleEdit(domain)}>
                    Edit
                  </Button>
                  <Button variant="outlined" onClick={() => handleShowStudents(domain.domainId)}>
                    Show Students
                  </Button>
                  </div>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
      component="div"
      count={Math.ceil(filteredDomains.length / rowsPerPage)}
      page={page}
      onChange={handlePageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
      </div>
      

      <Modal open={showModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <h3>Create Domain</h3>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Domain Name"
              name="program"
              value={newDomain.program}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Batch"
              name="batch"
              value={newDomain.batch}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={newDomain.capacity}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Qualification"
              name="qualification"
              value={newDomain.qualification}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Create
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={showEditModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <h3>Edit Domain</h3>
          <form onSubmit={handleEditSubmit}>
            <TextField
              label="Domain Name"
              name="program"
              value={currentDomain?.program || ''}
              onChange={handleEditChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Batch"
              name="batch"
              value={currentDomain?.batch || ''}
              onChange={handleEditChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={currentDomain?.capacity || ''}
              onChange={handleEditChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Qualification"
              name="qualification"
              value={currentDomain?.qualification || ''}
              onChange={handleEditChange}
              fullWidth
              required
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Update
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={showStudentsModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <h3>Students</h3>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell></TableCell>
                {/* <TableCell>Student ID</TableCell> */}
                <TableCell>Roll Number</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>CGPA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell>
                  <img
                    src={getImageUrl(student.photographPath)}
                    alt={`${student.firstName}'s Photograph`}
                    style={imageStyle}
                  />
                </TableCell>
                  {/* <TableCell>{student.studentId}</TableCell> */}
                  <TableCell>{student.rollNumber}</TableCell>

                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.cgpa}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Modal>

    </div>
    )}
    </>
  );
};

export default DomainList;
