import React, { useState, useEffect } from "react";
import GameCard from "../../components/user/GameCard";
import { Sparkles, Activity, Target, Clock, Users } from "lucide-react";
import axios from "axios";

const GameLibrary = () => {
  const [games, setGames] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const req = await axios.get("http://localhost:3000/games");
        setGames(req.data);
      } catch (error) {
        console.error("Error fetching games", error);
      }
    };

    const fetchUserStats = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        try {
          const res = await axios.get("http://localhost:3000/users/progress/stats", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserStats(res.data.stats);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      }
    };

    fetchGames();
    fetchUserStats();
  }, []);

  const getIcon = (name) => {
    const lowerName = name?.toLowerCase() || '';
    if (lowerName.includes('canvas') || lowerName.includes('draw')) return <Sparkles size={24} color="var(--primary)" />;
    if (lowerName.includes('shape') || lowerName.includes('trace')) return <Activity size={24} color="var(--accent)" />;
    return <Target size={24} color="var(--success)" />;
  };

  return (
    <>
      <div className="page-container" style={{ padding: "4rem 2rem" }}>

        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> Choose Your Exercise
          </div>
          <h1 style={{ marginBottom: "0.5rem" }}>Game Library</h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "500px" }}>
            Select a game below to start your hand exercise session. Each game targets different aspects of hand mobility and coordination.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          marginBottom: "4rem"
        }}>
          {[
            { value: games.length.toString(), label: 'Active Games' },
            { value: userStats ? userStats.total_games_played.toString() : '3K+', label: isLoggedIn ? 'Your Sessions' : 'Active Players' },
            { value: userStats ? userStats.total_score.toString() : '1.2K', label: isLoggedIn ? 'Total Score' : 'Sessions Today' },
            { value: userStats ? parseFloat(userStats.average_accuracy).toFixed(1) + '%' : '23%', label: isLoggedIn ? 'Avg accuracy' : 'Avg. Improvement' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <h2 style={{ marginBottom: '0.2rem' }}>{stat.value}</h2>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem"
        }}>
          {games.length === 0 ? (
             <div style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active games available at the moment.
             </div>
          ) : (
            games.map(game => (
              <GameCard
                key={game.game_id}
                title={game.game_name}
                description={game.description}
                icon={getIcon(game.game_name)}
                difficulty={game.difficulty_level || 'Medium'}
                time="5-10 min"
                playing="Active playing"
                benefits={game.benefits ? game.benefits.split(/,|\n/).map(b => b.trim()).filter(Boolean) : [
                  "Hand motor control",
                  "Coordination",
                  "Focus"
                ]}
              />
            ))
          )}
        </div>

        <div style={{ marginTop: '5rem', textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem auto', color: 'var(--text-muted)'
          }}>
            <Sparkles size={24} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>More Games Coming Soon</h3>
          <p style={{ color: 'var(--text-muted)' }}>We are working on new exciting games including Puzzle Challenge and Finger Piano!</p>
        </div>

      </div>
    </>
  );
};

export default GameLibrary;