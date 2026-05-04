import StatCard from "../common/StatCard";

const GameStatsPanel = () => {
  return (
    <div className="game-stats">
      <StatCard title="Duration" value="00:00" />
      <StatCard title="Score" value="0" />
    </div>
  );
};

export default GameStatsPanel;