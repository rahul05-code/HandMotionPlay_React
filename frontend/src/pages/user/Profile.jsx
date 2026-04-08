import React, { useState } from "react";
import { User, Edit3, X, Save } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUser } = useAuth();

  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || "",
    gender: user?.gender || "Male",
    hand_type: user?.hand_type || "Right",
    therapy_type: user?.therapy_type || "Physical",
    joined_at: user?.created_at ? new Date(user.created_at).toISOString().split('T')[0] : "Pending",
    last_updated: user?.updated_at ? new Date(user.updated_at).toISOString().split('T')[0] : "Pending",
    status: user?.is_active ? "Active" : "Inactive"
  });

  const [progressData, setProgressData] = useState({ stats: null, chartData: [] });

  React.useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:3000/users/progress/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgressData(res.data);
      } catch (err) {
        console.error("Failed to fetch user progress", err);
      }
    };
    fetchProgress();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:3000/users/profile', userData);

      // Formulate updated context object combining previous user with saved ones
      const newlySaved = res.data.user;
      updateUser(newlySaved);

      setUserData(prev => ({
        ...prev,
        name: newlySaved.name || "",
        age: newlySaved.age || "",
        gender: newlySaved.gender || "Male",
        hand_type: newlySaved.hand_type || "Right",
        therapy_type: newlySaved.therapy_type || "Physical",
        last_updated: newlySaved.updated_at ? new Date(newlySaved.updated_at).toISOString().split('T')[0] : "Pending"
      }));

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      // You could also add an error state here if requested
    }
  };

  // Form input styles
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-main)',
    marginTop: '0.5rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    fontWeight: '500'
  };

  return (
    <div className="page-container" style={{ paddingTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <User color="var(--primary)" size={28} /> User Profile
      </h2>

      <Card style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <User size={40} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{userData.name || "User Name"}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: '1rem' }}>{userData.email}</p>
              <div style={{ marginTop: '0.5rem', display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', backgroundColor: userData.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: userData.status === 'Active' ? '#22c55e' : '#ef4444', fontWeight: '500' }}>
                {userData.status}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '150px' }}>
            {!isEditing && (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
                style={{ padding: '0.75rem 1.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Content: Form vs Details Display */}
        {isEditing ? (
          <form onSubmit={handleSave} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Edit Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" name="name" value={userData.name} onChange={handleChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" name="email" value={userData.email} onChange={handleChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Age</label>
                <input type="number" name="age" value={userData.age} onChange={handleChange} style={inputStyle} required min="1" max="120" />
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <select name="gender" value={userData.gender} onChange={handleChange} style={inputStyle}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Dominant Hand / Hand Type</label>
                <select name="hand_type" value={userData.hand_type} onChange={handleChange} style={inputStyle}>
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Therapy Type</label>
                <select name="therapy_type" value={userData.therapy_type} onChange={handleChange} style={inputStyle}>
                  <option value="Physical">Physical</option>
                  <option value="Occupational">Occupational</option>
                  <option value="Cognitive">Cognitive</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsEditing(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
              >
                <X size={16} /> Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Profile Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <span style={labelStyle}>Age</span>
                <p style={{ marginTop: '0.25rem', fontWeight: '500', fontSize: '1.1rem' }}>{userData.age ? `${userData.age} Years` : "Pending"}</p>
              </div>
              <div>
                <span style={labelStyle}>Gender</span>
                <p style={{ marginTop: '0.25rem', fontWeight: '500', fontSize: '1.1rem' }}>{userData.gender || "Pending"}</p>
              </div>
              <div>
                <span style={labelStyle}>Hand Type</span>
                <p style={{ marginTop: '0.25rem', fontWeight: '500', fontSize: '1.1rem' }}>{userData.hand_type || "Pending"}</p>
              </div>
              <div>
                <span style={labelStyle}>Therapy Type</span>
                <p style={{ marginTop: '0.25rem', fontWeight: '500', fontSize: '1.1rem' }}>{userData.therapy_type || "Pending"}</p>
              </div>
              <div>
                <span style={labelStyle}>Joined At</span>
                <p style={{ marginTop: '0.25rem', fontWeight: '500', fontSize: '1.1rem' }}>{userData.joined_at}</p>
              </div>
              <div>
                <span style={labelStyle}>Last Updated</span>
                <p style={{ marginTop: '0.25rem', fontWeight: '500', fontSize: '1.1rem' }}>{userData.last_updated}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Stats */}
      <h3 style={{ marginTop: "2rem", marginBottom: "1rem", fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Your Progress
      </h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        <StatCard title="Games Played" value={progressData.stats?.total_games_played || 0} />
        <StatCard title="Total Time Spent" value={`${progressData.stats?.total_time_spent || 0} mins`} />
        <StatCard title="Average Accuracy" value={`${parseFloat(progressData.stats?.average_accuracy || 0).toFixed(1)}%`} />
      </div>

      {progressData.chartData.length > 0 ? (
        <Card style={{ padding: '2rem', marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Performance History</h4>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData.chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" />
                <YAxis yAxisId="left" stroke="var(--text-muted)" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#a855f7" strokeWidth={3} name="Accuracy (%)" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} name="Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : (
        <Card style={{ padding: '2rem', marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No recent session data to display charts. Play games to track your progress!</p>
        </Card>
      )}


    </div>
  );
};

export default Profile;