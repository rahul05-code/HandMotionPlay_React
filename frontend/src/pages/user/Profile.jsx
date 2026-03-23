import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic redirect to login for now
    navigate('/login');
  };

  return (
    <div className="page-container" style={{ paddingTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <User color="var(--primary)" size={28} /> User Profile
      </h2>

      {/* Profile Info */}
      <Card style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <User size={40} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Rahul Kanzariya</h3>
            <p style={{ color: "var(--text-muted)", fontSize: '1rem' }}>rahul@email.com</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '150px' }}>
            <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', width: '100%' }}>
              Edit Profile
            </button>
            <button 
              className="btn btn-outline" 
              onClick={handleLogout}
              style={{ 
                padding: '0.75rem 1.5rem', 
                width: '100%', 
                borderColor: 'var(--danger)', 
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </Card>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
          marginTop: "30px"
        }}>
          <StatCard title="Games Played" value="45" />
          <StatCard title="Best Accuracy" value="92%" />
          <StatCard title="Achievements" value="12" />
        </div>

    </div>
  );
};

export default Profile;