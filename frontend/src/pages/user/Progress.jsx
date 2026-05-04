import React, { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import { BarChart2, Clock, Target, Award, Flame, TrendingUp, Edit2, Hexagon, Circle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Line, Legend } from 'recharts';
const ActivityBarChart = ({ data }) => (
  <div style={{ height: '220px', width: '100%', marginTop: '1.5rem' }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
        <RechartsTooltip
          cursor={{ fill: 'var(--card-border)' }}
          contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
          itemStyle={{ color: 'var(--primary)' }}
        />
        <Bar dataKey="active" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const AccuracyLineChart = ({ data }) => (
  <div style={{ height: '220px', width: '100%', marginTop: '1.5rem' }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 100]} />
        <RechartsTooltip
          contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
          itemStyle={{ color: 'var(--success)' }}
        />
        <Area type="monotone" dataKey="accuracy" stroke="var(--success)" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const COLORS = ['#0088ff', '#ff007f', '#00e676', '#f59e0b'];

const GameDistributionPieChart = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-muted)' }}>No game data yet</div>;
  return (
  <div style={{ height: '220px', width: '100%', marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={75}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <RechartsTooltip
          contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
          itemStyle={{ color: 'var(--text-main)' }}
        />
      </PieChart>
    </ResponsiveContainer>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
      {data.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>{entry.name}</div>
      ))}
    </div>
  </div>
)};

const MonthlyPerformanceChart = ({ data }) => (
  <div style={{ height: '220px', width: '100%', marginTop: '1rem' }}>
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
        <RechartsTooltip
          contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
          itemStyle={{ color: 'var(--text-main)' }}
          labelStyle={{ color: 'var(--text-main)' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
        <Line yAxisId="left" type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
        <Line yAxisId="right" type="monotone" dataKey="time" name="Time (min)" stroke="#ff007f" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

const Progress = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:3000/users/progress/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch progress metrics", err);
      }
    };
    fetchProgressData();
  }, []);

  if (!data) return <div className="page-container" style={{ padding: "4rem 2rem", textAlign: 'center' }}>Loading Progress Data...</div>;

  const { stats, chartData, recentSessions, allData } = data;

  // Derived calculations from allData
  const activeDays = {};
  allData.forEach(d => {
      const day = new Date(d.created_at).toLocaleDateString('en-US', { weekday: 'short' });
      if (!activeDays[day]) activeDays[day] = { count: 0, accuracySum: 0 };
      activeDays[day].count++;
      activeDays[day].accuracySum += d.accuracy;
  });
  
  const weeklyActivityData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day, 
      active: activeDays[day]?.count || 0,
      accuracy: activeDays[day] ? (activeDays[day].accuracySum / activeDays[day].count).toFixed(1) : 0
  }));

  const distMap = {};
  allData.forEach(d => {
      distMap[d.game_name] = (distMap[d.game_name] || 0) + 1;
  });
  const gameDistributionData = Object.keys(distMap).map(k => ({ name: k, value: distMap[k] }));

  const monthlyData = chartData.slice(-10).map((d, i) => ({
      week: `Session ${i+1}`,
      accuracy: d.accuracy,
      time: Math.round(d.time_spent ? d.time_spent / 60 : 1) // default 1 min
  }));

  const getGameIcon = (name) => {
      if (name.includes('Drawing')) return <Edit2 size={16} />;
      if (name.includes('Target')) return <Target size={16} />;
      return <Hexagon size={16} />;
  };

  return (
    <>
      <div className="page-container" style={{ padding: "4rem 2rem", maxWidth: "1200px" }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ marginBottom: "0.5rem" }}>Progress Dashboard</h2>
            <p style={{ color: "var(--text-muted)" }}>Track your hand exercise journey and monitor improvements</p>
          </div>

          {/* Time Range Selector */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['Week', 'Month', 'All Time'].map(range => (
              <button key={range} style={{
                background: range === 'Week' ? 'var(--primary)' : 'transparent',
                color: range === 'Week' ? 'white' : 'var(--text-main)',
                border: range === 'Week' ? 'none' : '1px solid var(--border-color)',
                padding: '0.6rem 2rem',
                borderRadius: '50px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "1.5rem",
          marginBottom: "3rem"
        }}>
          <StatCard icon={<BarChart2 size={24} />} title="Total Sessions" value={stats.total_games_played} colorHex="#0088ff" />
          <StatCard icon={<Clock size={24} />} title="Total Time" value={`${Math.round(stats.total_time_spent / 60)}h ${stats.total_time_spent % 60}m`} colorHex="#0088ff" />
          <StatCard icon={<Target size={24} />} title="Avg Accuracy" value={`${parseFloat(stats.average_accuracy).toFixed(1)}%`} colorHex="#00e676" />
          <StatCard icon={<Award size={24} />} title="Total Score" value={stats.total_score} colorHex="#db2777" />
          <StatCard icon={<Flame size={24} />} title="Day Streak" value="Active" colorHex="#f59e0b" />
          <StatCard icon={<TrendingUp size={24} />} title="Improvement" value={stats.total_games_played > 0 ? "Tracking" : "Need Data"} colorHex="#00e676" />
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <Card>
            <h4 style={{ marginBottom: '1rem' }}>Weekly Activity</h4>
            <ActivityBarChart data={weeklyActivityData} />
          </Card>

          <Card>
            <h4 style={{ marginBottom: '1rem' }}>Accuracy Trend</h4>
            <AccuracyLineChart data={weeklyActivityData} />
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <Card>
            <h4 style={{ marginBottom: '1rem' }}>Game Distribution</h4>
            <GameDistributionPieChart data={gameDistributionData} />
          </Card>

          <Card>
            <h4 style={{ marginBottom: '1rem' }}>Recent Performance</h4>
            <MonthlyPerformanceChart data={monthlyData} />
          </Card>
        </div>

        {/* Detailed Sections Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>

          {/* Recent Sessions */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h4>Recent Sessions</h4>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>View All ⌄</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentSessions && recentSessions.length > 0 ? recentSessions.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: i !== recentSessions.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,136,255,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getGameIcon(s.game)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{s.game}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(s.rawDate).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>{s.score} pts</div>
                    <div style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: '500' }}>{parseFloat(s.accuracy).toFixed(1)}% acc</div>
                  </div>
                </div>
              )) : <div style={{ color: 'var(--text-muted)' }}>No recent sessions.</div>}
            </div>
          </Card>

          {/* Achievements */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h4>Achievements</h4>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>4/6 Earned</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Earned */}
              <div style={{ background: 'rgba(0,136,255,0.05)', border: '1px solid rgba(0,136,255,0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--primary)', background: 'rgba(0,136,255,0.1)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Award size={18} /></div>
                <div><div style={{ fontWeight: '600', fontSize: '0.9rem' }}>First Steps</div><div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Complete your first session</div></div>
              </div>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--primary)', background: 'rgba(0,136,255,0.1)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Flame size={18} /></div>
                <div><div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Week Warrior</div><div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Exercise for 7 consecutive days</div></div>
              </div>

              {/* Locked */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', opacity: 0.5 }}>
                <div style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Target size={18} /></div>
                <div><div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Sharp Shooter</div><div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Reach 90% accuracy in shooting</div></div>
              </div>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--primary)', background: 'rgba(0,136,255,0.1)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Hexagon size={18} /></div>
                <div><div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Perfect Trace</div><div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Complete a shape with 95%+</div></div>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Great Progress This Week!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You have improved your accuracy by 23% and maintained a 7-day streak. Keep it up!</p>
          <button className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Schedule Next Session</button>
        </div>

      </div>
    </>
  );
};

export default Progress;