import Card from "../common/Card";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";

const GameCard = ({ title, description, icon, difficulty, time, playing, benefits }) => {
    // Simple mapping to routes based on title
    const getRoute = () => {
        if (title.includes("Canvas")) return "/games/canvas";
        if (title.includes("Target")) return "/games/target";
        if (title.includes("Tracing")) return "/games/trace";
        return "/games";
    };

    const getDifficultyColor = () => {
        if (difficulty === 'Easy') return 'var(--success)';
        if (difficulty === 'Medium') return '#f59e0b';
        if (difficulty === 'Hard') return 'var(--danger)';
        return 'var(--primary)';
    };

    return (
        <Card style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            {/* Top row with Icon and Difficulty */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(0, 136, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>

                {difficulty && (
                    <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: getDifficultyColor(),
                        background: `${getDifficultyColor()}15`, // HEX with 15 opacity
                        border: `1px solid ${getDifficultyColor()}30`
                    }}>
                        {difficulty}
                    </div>
                )}
            </div>

            <h3 style={{ marginBottom: "0.5rem" }}>{title}</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{description}</p>

            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem', fontWeight: '500' }}>
                {time && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> {time}
                    </div>
                )}
                {playing && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Users size={14} /> {playing}
                    </div>
                )}
            </div>

            {benefits && benefits.length > 0 && (
                <div style={{ marginBottom: '2rem', flexGrow: 1 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Benefits:</div>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {benefits.map((benefit, idx) => (
                            <li key={idx} style={{ color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: '500' }}>
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Link to={getRoute()} style={{ marginTop: 'auto' }}>
                <button className="btn btn-primary" style={{ width: "100%", padding: '0.6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}>
                    Play Now <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>→</span>
                </button>
            </Link>
        </Card>
    );
};

export default GameCard;
