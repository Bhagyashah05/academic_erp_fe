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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDomain((prevDomain) => ({
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
      const response = await axios.post('http://localhost:8080/api/v1/domain', domainToSubmit);
      setDomains([...domains, response.data]); 
      setShowModal(false);  
      setNewDomain({ name: '', batch: '', capacity: '', qualification: '' }); 
    } catch (err) {
      setError('Error creating domain');
    }
  };

  const handleEdit = (domainId) => {
    console.log(`Edit domain with ID: ${domainId}`);
  };

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
              <td>{domain.program}</td>
              <td>{domain.batch}</td>
              <td>{domain.capacity}</td>
              <td>{domain.qualification}</td>
              <td>
                <button onClick={() => handleEdit(domain.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
              <button type="submit">Create</button>
              <button type="button" onClick={handleCloseModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainList;
