import AdminStatCard from "../../components/admin/AdminStatCard";
import Card from "../../components/common/Card";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useState } from "react";

const userGrowthData = [
  ...Array(7).fill(0).map((_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    activity: [3, 4, 2, 5, 3, 6, 4][i],
    sessions: [72, 75, 68, 82, 78, 85, 88][i]
  }))
];

const pieData = [
  { name: 'Drawing', value: 45 },
  { name: 'Tracing', value: 35 },
  { name: 'Shooting', value: 20 },
];
const COLORS = ['#6366f1', '#ec4899', '#10b981']; // Primary, Accent, Success

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('Day');

  return (
    <div className="page-container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Detailed Performance metrics and insights.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        {['Day', 'Week', 'Month', 'Year'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              padding: '0.4rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              color: timeRange === range ? 'white' : 'var(--text-main)',
              backgroundColor: timeRange === range ? '#0088ff' : 'transparent',
              border: timeRange === range ? 'none' : '1px solid var(--border-color)',
              transition: 'all 0.2s',
            }}
          >
            {range}
          </button>
        ))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        <AdminStatCard title="Total Users" value="1,250" trend="+12% from last month" trendUp={true} />
        <AdminStatCard title="Active Users" value="847" trend="67% active rate" trendUp={true} />
        <AdminStatCard title="Total Sessions" value="15,420" trend="+8% from last month" trendUp={true} />
        <AdminStatCard title="Total Score" value="9.2 M" trend="Point Earned" trendUp={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* User Growth & Sessions */}
        <Card>
          <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>User Growth & Sessions</h4>
          <div style={{ height: "250px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
                <XAxis dataKey="day" axisLine={{stroke: 'var(--border-color)'}} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={{stroke: 'var(--border-color)'}} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} domain={[60, 100]} tickCount={5} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--success)' }}
                  labelStyle={{ color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="sessions" stroke="var(--success)" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Game Distribution */}
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Game Distribution</h4>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ height: "200px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
              {pieData.map((entry, index) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Score Trends */}
        <Card>
          <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Score Trends</h4>
          <div style={{ height: "250px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
                <XAxis dataKey="day" axisLine={{stroke: 'var(--border-color)'}} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={{stroke: 'var(--border-color)'}} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} domain={[0, 8]} tickCount={5} />
                <Tooltip
                  cursor={{ fill: 'var(--card-border)' }}
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
                  itemStyle={{ color: '#a855f7' }}
                  labelStyle={{ color: 'var(--text-main)' }}
                />
                <Bar dataKey="activity" fill="#a855f7" radius={[2, 2, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Game Performance Table */}
        <Card>
          <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Game Performance</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr', 
            gap: '1rem', 
            marginTop: '1.5rem' 
          }}>
            {/* Headers */}
            <div style={{ color: '#0088ff', fontWeight: 'bold', fontSize: '0.95rem' }}>Game Name</div>
            <div style={{ color: '#0088ff', fontWeight: 'bold', fontSize: '0.95rem' }}>Total Players</div>
            <div style={{ color: '#0088ff', fontWeight: 'bold', fontSize: '0.95rem' }}>Average Score</div>
            
            {/* Row 1 */}
            <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', alignSelf: 'center', paddingTop: '1rem' }}>Canvas Drawing</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', alignSelf: 'center', paddingTop: '1rem' }}>8,520</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', alignSelf: 'center', paddingTop: '1rem' }}>780</div>
            
            {/* Row 2 */}
            <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', alignSelf: 'center', paddingTop: '1rem' }}>Shape Tracing</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', alignSelf: 'center', paddingTop: '1rem' }}>6,450</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', alignSelf: 'center', paddingTop: '1rem' }}>620</div>
            
            {/* Row 3 */}
            <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', alignSelf: 'center', paddingTop: '1rem' }}>Target Shooting</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', alignSelf: 'center', paddingTop: '1rem' }}>4,230</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', alignSelf: 'center', paddingTop: '1rem' }}>450</div>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default Analytics;
