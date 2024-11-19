import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DomainList = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newDomain, setNewDomain] = useState({
    program: '',
    batch: '',
    capacity: '',
    qualification: ''
  });
  const [showeditModal,setshoweditModal]=useState(false);
  const [currentdomain,setcurrentdomain]=useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/domain');
        setDomains(response.data);
      } catch (err) {
        setError('Error fetching domains');
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  const handleCreateClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setshoweditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDomain((prevDomain) => ({
      ...prevDomain,
      [name]: value,
    }));
  };

  const handleEditChange=(e)=>{
    const {name,value}=e.target;
    setcurrentdomain((prevDomain)=>({
        ...prevDomain,
        [name]:value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const domainToSubmit = {
      ...newDomain,
      capacity: parseInt(newDomain.capacity, 10) 
    };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/domain', domainToSubmit);
      setDomains([...domains, response.data]); 
      setShowModal(false);  
      setNewDomain({ name: '', batch: '', capacity: '', qualification: '' }); 
    } catch (err) {
      setError('Error creating domain');
    }
  };

  const handleEditSubmit=async(e)=>{
    e.preventDefault();

    const domaintoEdit={
        ...currentdomain,
        capacity:parseInt(currentdomain.capacity,10)
    }
    console.log("Domain object being sent:", domaintoEdit);
    try{
       const res= await axios.put(`http://localhost:8080/api/v1/domain/${domaintoEdit.domainId}`, domaintoEdit);
        setDomains((prevDomains) =>
            prevDomains.map((domain) => (domain.domainId === domaintoEdit.domainId ? domaintoEdit : domain))
          );
          setshoweditModal(false);
    }
    catch(err){
        setError('Error editing domain');
    }
  }

  const handleEdit = (domain) => {
    // console.log(`Edit domain with ID: ${domainId}`);
    setcurrentdomain(domain);
    setshoweditModal(true);
  };

  const handleCloseEditModal=()=>{
    setcurrentdomain(null);
    setshoweditModal(false);
  }



  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="domain-list-container">
      <div className="header">
        <h2>Domain List</h2>
        <button className="create-domain-button" onClick={handleCreateClick}>
          Create Domain
        </button>
      </div>

      <table className="domain-table">
        <thead>
          <tr>
            <th>Domain Name</th>
            <th>Batch</th>
            <th>Capacity</th>
            <th>Qualification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {domains.map((domain) => (
            <tr key={domain.id}>
              <td>{domain.program?domain.program.toUpperCase():"Not Available"}</td>
              <td>{domain.batch?domain.batch:"Not Available"}</td>
              <td>{domain.capacity}</td>
              <td>{domain.qualification?domain.qualification.toUpperCase():"Not Available"}</td>
              <td>
                <button onClick={() => handleEdit(domain)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showeditModal && (
        <div className="modal-overlay">
        <div className="modal-content">
          <h3>Edit Domain</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="input-group">
              <label htmlFor="name">Domain Name:</label>
              <input
                type="text"
                id="program"
                name="program"
                value={currentdomain.program?currentdomain.program.toUpperCase():""}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="batch">Batch:</label>
              <input
                type="text"
                id="batch"
                name="batch"
                value={currentdomain.batch}
                onChange={handleEditChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="capacity">Capacity:</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={currentdomain.capacity}
                onChange={handleEditChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="qualification">Qualification:</label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={currentdomain.qualification?currentdomain.qualification.toUpperCase():""}
                onChange={handleEditChange}
                required
              />
            </div>
            <button type="submit" style={{ marginBottom: '10px' }}>Edit</button>
            <button type="button" onClick={handleCloseEditModal} >Cancel</button>

          </form>
        </div>
      </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create Domain</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Domain Name:</label>
                <input
                  type="text"
                  id="program"
                  name="program"
                  value={newDomain.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="batch">Batch:</label>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  value={newDomain.batch}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="capacity">Capacity:</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={newDomain.capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="qualification">Qualification:</label>
                <input
                  type="text"
                  id="qualification"
                  name="qualification"
                  value={newDomain.qualification}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" style={{ marginBottom: '10px' }}>Create</button>
              <button type="button" onClick={handleCloseModal} >Cancel</button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainList;
