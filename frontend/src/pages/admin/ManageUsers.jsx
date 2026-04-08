import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2, X, Save, Power } from "lucide-react";
import Card from "../../components/common/Card";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const req = await axios.get('http://localhost:3000/admin/users');
      // Format response data to match frontend expectations
      const formattedUsers = req.data.map(u => ({
        id: u.user_id,
        name: u.name || "N/A",
        email: u.email,
        joinDate: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : "N/A",
        status: u.is_active ? "active" : "inactive",
        gamesPlayed: u.games_played || 0, // Mocking if not in DB
        totalScore: u.total_score || 0, // Mocking if not in DB
        age: u.age || "",
        gender: u.gender || "Other",
        hand_type: u.hand_type || "Right",
        therapy_type: u.therapy_type || "None"
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.log("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/admin/users/${editingUser.id}`, {
        ...editingUser
      });
      fetchUsers(); // Refresh
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await axios.put(`http://localhost:3000/admin/users/${user.id}`, {
        ...user,
        status: newStatus
      });
      fetchUsers();
    } catch (error) {
      console.error("Error toggling status", error);
    }
  };

  // Form input styles
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-main)',
    marginTop: '0.5rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    fontWeight: '500'
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container" style={{ paddingTop: '2rem', position: 'relative' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Manage Users</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>View and manage all platform users.</p>
      </div>

      {/* Edit User Modal Overlay */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Edit User Details</h3>
              <button 
                onClick={() => setEditingUser(null)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="name" value={editingUser.name} onChange={handleEditChange} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" name="email" value={editingUser.email} onChange={handleEditChange} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input type="number" name="age" value={editingUser.age || ''} onChange={handleEditChange} style={inputStyle} min="1" max="120" />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select name="gender" value={editingUser.gender || 'Other'} onChange={handleEditChange} style={inputStyle}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Dominant Hand / Hand Type</label>
                  <select name="hand_type" value={editingUser.hand_type || 'Right'} onChange={handleEditChange} style={inputStyle}>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Therapy Type</label>
                  <select name="therapy_type" value={editingUser.therapy_type || 'None'} onChange={handleEditChange} style={inputStyle}>
                    <option value="Physical">Physical</option>
                    <option value="Occupational">Occupational</option>
                    <option value="Cognitive">Cognitive</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Account Status</label>
                  <select name="status" value={editingUser.status} onChange={handleEditChange} style={inputStyle}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)', 
                    backgroundColor: 'transparent', 
                    color: 'var(--text-main)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <X size={16} /> Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px', 
                    border: 'none', 
                    backgroundColor: 'var(--primary)', 
                    color: '#fff',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: 'var(--card-bg)', 
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        border: '1px solid var(--border-color)'
      }}>
        <Search size={20} color="var(--text-main)" style={{ marginRight: '1rem' }} />
        <input 
          type="text" 
          placeholder="Search Users by name or email" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            outline: 'none', 
            color: 'var(--text-main)', 
            width: '100%',
            fontSize: '1rem'
          }} 
        />
      </div>

      {/* Data Table Container */}
      <div style={{ 
        border: '1px solid var(--border-color)', 
        borderRadius: '8px', 
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)', fontSize: '0.95rem' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Name</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Email</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Join Date</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Game played</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Total Score</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No users found matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr 
                  key={user.id} 
                  style={{ 
                    backgroundColor: idx % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    borderBottom: idx === filteredUsers.length - 1 ? 'none' : '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    fontWeight: '500' // slightly lighter weight than 600
                  }}
                >
                  <td style={{ padding: '1rem 1.5rem' }}>{user.name}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{user.joinDate}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.2rem 0.8rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor: user.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: user.status === 'active' ? '#10b981' : '#ef4444'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold', fontSize: '1.05rem' }}>{user.gamesPlayed}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{user.totalScore}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                      <button 
                        onClick={() => handleToggleStatus(user)}
                        title={user.status === 'active' ? "Deactivate User" : "Activate User"}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: user.status === 'active' ? '#f59e0b' : '#10b981' }}
                      >
                        <Power size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditClick(user)}
                        title="Edit User"
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        title="Delete User"
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Total Users</div>
          <div style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 'bold' }}>{users.length}</div>
        </div>
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Active Users</div>
          <div style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {users.filter(u => u.status === 'active').length}
          </div>
        </div>
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Avg Games Played</div>
          <div style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {users.length > 0 ? (users.reduce((acc, curr) => acc + curr.gamesPlayed, 0) / users.length).toFixed(1) : 0}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ManageUsers;
