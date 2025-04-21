import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 4;

  const fetchUsers = useCallback(async (page, search = '') => {
    try {
      setLoading(true);
      const start = (page - 1) * usersPerPage;
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users?_start=${start}&_limit=${usersPerPage}${search ? `&name_like=${search}` : ''}`);
      const totalCount = parseInt(response.headers['x-total-count'] || '0');
      setUsers(response.data);
      setTotalUsers(totalCount);
      setError(null);
    } catch (err) {
      setError('Error fetching users. Please try again later.');
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, [usersPerPage]);

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchUsers]);

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(event.target.value);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">User Dashboard</h1>
      
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search users by name..."
          defaultValue={searchTerm}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="row">
        {users.map(user => (
          <div key={user.id} className="col-md-6 col-lg-3">
            <UserCard user={user} />
          </div>
        ))}
      </div>

      {totalPages > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <li
                  key={number}
                  className={`page-item ${currentPage === number ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Dashboard;