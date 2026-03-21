import GameCard from "../../components/user/GameCard";
import { Sparkles, Activity, Target, Clock, Users } from "lucide-react";

const GameLibrary = () => {
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
            { value: '3', label: 'Total Games' },
            { value: '3K+', label: 'Active Players' },
            { value: '1.2K', label: 'Sessions Today' },
            { value: '23%', label: 'Avg. Improvement' }
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
          <GameCard
            title="Canvas Drawing"
            description="Draw in the air using your index finger. Express creativity while improving fine motor control."
            icon={<Sparkles size={24} color="var(--primary)" />}
            difficulty="Easy"
            time="5-10 min"
            playing="1K+ playing"
            benefits={[
              "Fine motor control",
              "Hand-eye coordination",
              "Creative expression"
            ]}
          />
          <GameCard
            title="Shape Tracing"
            description="Follow the outline of various shapes to enhance precision and hand-eye coordination."
            icon={<Activity size={24} color="var(--accent)" />}
            difficulty="Medium"
            time="3-5 min"
            playing="850+ playing"
            benefits={[
              "Precision control",
              "Pattern recognition",
              "Steady hand movement"
            ]}
          />
          <GameCard
            title="Target Shooting"
            description="Aim and shoot targets using finger gestures. Develop quick reflexes and accuracy."
            icon={<Target size={24} color="var(--success)" />}
            difficulty="Hard"
            time="5-15 min"
            playing="1.2K+ playing"
            benefits={[
              "Quick reflexes",
              "Finger pointing accuracy",
              "Hand speed"
            ]}
          />
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