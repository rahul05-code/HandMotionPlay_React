import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { Mail, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const req = await axios.post('http://localhost:3000/login', {
        email,
        password
      });
      const res = req.data;
      setSuccess('Login successful !');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setSuccess('');
      setError(err.response?.data?.message || 'Login failed !');
    }
  }


  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <Card style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', background: 'var(--card-bg)' }}>

        {/* Custom Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>
            <span style={{ color: "var(--text-main)" }}>Log</span>
            <span style={{ color: "var(--primary)" }}>in</span>
          </h2>
        </div>

        <form onSubmit={loginHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Email Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <label htmlFor="email" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Email :</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                placeholder="Enter Your Email"
                required
                style={{
                  width: '100%', padding: '1rem', paddingRight: '3rem',
                  background: 'var(--bg-main)', border: '1px solid var(--border-color)',
                  borderRadius: '12px', color: 'var(--text-main)', fontSize: '1rem',
                  fontFamily: 'inherit', outline: 'none'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Password :</label>
              <a href="#" style={{ fontSize: '0.8rem', color: "var(--primary)", textDecoration: 'none', fontWeight: '600' }}>Forgot password ?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                placeholder="Enter Password"
                required
                style={{
                  width: '100%', padding: '1rem', paddingRight: '3rem',
                  background: 'var(--bg-main)', border: '1px solid var(--border-color)',
                  borderRadius: '12px', color: 'var(--text-main)', fontSize: '1rem',
                  fontFamily: 'inherit', outline: 'none'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <EyeOff size={20} color="var(--text-muted)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
            </div>
            {error && <span style={{ color: 'var(--danger, #ef4444)', fontSize: '0.85rem' }}>{error}</span>}
            {success && <span style={{ color: 'var(--success, #10b981)', fontSize: '0.85rem' }}>{success}</span>}
          </div>

          {/* CTA Button */}
          <div style={{ marginTop: '0.5rem' }}>
            <button type="submit" style={{
              width: '100%', padding: '1rem',
              background: 'linear-gradient(90deg, #0088ff, #00bcff)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
              transition: 'transform 0.2s',
            }}>
              Login To Continue
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.95rem", fontWeight: '500' }}>
          Don't have an account? <span style={{ color: "var(--text-main)" }}>Go to</span> <Link to="/register" style={{ color: "var(--primary)", textDecoration: 'none' }}>Register</Link>
        </div>

      </Card>
    </div>
  );
}
