import AdminStatCard from "../../components/admin/AdminStatCard";
import Card from "../../components/common/Card";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Users, UserCheck, Gamepad2, TrendingUp } from 'lucide-react';

const userGrowthData = [
  ...Array(7).fill(0).map((_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    activity: [3, 4, 2, 5, 3, 6, 4][i],
    accuracy: [72, 75, 68, 82, 78, 85, 88][i]
  }))
];

const AdminDashboard = () => {
  return (
    <div className="page-container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Welcome back! Here's your performance overview.</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        <AdminStatCard title="Total Users" value="1,250" icon={<Users size={24} />} trend="12%" trendUp={true} />
        <AdminStatCard title="Active User" value="820" icon={<UserCheck size={24} />} trend="8%" trendUp={true} />
        <AdminStatCard title="Total Sessions" value="15,420" icon={<Gamepad2 size={24} />} trend="15%" trendUp={true} />
        <AdminStatCard title="Avg Session Time" value="12.5 min" icon={<TrendingUp size={24} />} trend="2min" trendUp={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card>
          <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Weekly Activity</h4>
          <div style={{ height: "250px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 8]} tickCount={5} />
                <Tooltip
                  cursor={{ fill: 'var(--card-border)' }}
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                  itemStyle={{ color: '#a855f7' }}
                  labelStyle={{ color: 'var(--text-main)' }}
                />
                <Bar dataKey="activity" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Accuracy Trend</h4>
          <div style={{ height: "250px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[60, 100]} tickCount={5} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--success)' }}
                  labelStyle={{ color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="var(--success)" strokeWidth={3} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card style={{ 
        background: 'var(--bg-secondary)', 
        border: '1px solid var(--border-color)',
        padding: '2rem 3rem',
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', gap: '8rem', color: 'var(--text-main)' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: '500' }}>Total Score</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>9.2M</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: '500' }}>Most Popular Game</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Canvas Drawing</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Platform Status</div>
            <div style={{ color: 'var(--success)', fontSize: '1.2rem', fontWeight: 'bold' }}>Healthy</div>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default AdminDashboard;