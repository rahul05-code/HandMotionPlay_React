import React, { useState, useEffect } from "react";
import { Power, Plus, X, Save, Edit, Trash2 } from "lucide-react";
import axios from "axios";

const ManageGames = () => {
  const [games, setGames] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [gameIdToEdit, setGameIdToEdit] = useState(null);
  const [newGame, setNewGame] = useState({
    game_name: '',
    description: '',
    difficulty_level: 'Easy',
    category: 'Hand Therapy',
    benefits: ''
  });

  const fetchGames = async () => {
    try {
      const req = await axios.get('http://localhost:3000/admin/games');
      setGames(req.data);
    } catch (error) {
      console.error("Error fetching games", error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:3000/admin/games/${id}/status`, {
        is_active: !currentStatus
      });
      fetchGames(); // refresh list
    } catch (error) {
      console.error("Error toggling status", error);
    }
  };

  const deleteGame = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this game?")) {
      try {
        await axios.delete(`http://localhost:3000/admin/games/${id}`);
        fetchGames(); // refresh list
      } catch (error) {
        console.error("Error deleting game", error);
      }
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setGameIdToEdit(null);
    setNewGame({ game_name: '', description: '', difficulty_level: 'Easy', category: 'Hand Therapy', benefits: '' });
    setShowAddModal(true);
  };

  const openEditModal = (game) => {
    setIsEditing(true);
    setGameIdToEdit(game.game_id);
    setNewGame({
      game_name: game.game_name,
      description: game.description,
      difficulty_level: game.difficulty_level || 'Medium',
      category: game.category,
      benefits: game.benefits || ''
    });
    setShowAddModal(true);
  };

  const handleAddGameChange = (e) => {
    const { name, value } = e.target;
    setNewGame(prev => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/admin/games/${gameIdToEdit}`, newGame);
      } else {
        await axios.post('http://localhost:3000/admin/games', newGame);
      }
      setShowAddModal(false);
      fetchGames();
    } catch (error) {
      console.error("Error submitting game", error);
    }
  };

  const getDifficultyStyles = (diff) => {
    if (diff?.toLowerCase() === 'easy') return { color: "#10b981", bg: "rgba(16, 185, 129, 0.2)" };
    if (diff?.toLowerCase() === 'medium') return { color: "#eab308", bg: "rgba(234, 179, 8, 0.2)" };
    return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.2)" };
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
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
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Manage Games</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your learning modules and games.</p>
        </div>
        <button 
          onClick={openAddModal}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          <Plus size={20} /> Add Game
        </button>
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{isEditing ? 'Edit Game' : 'Add New Game'}</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Game Name</label>
                  <input type="text" name="game_name" value={newGame.game_name} onChange={handleAddGameChange} style={inputStyle} required placeholder="e.g. Puzzle Challenge" />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <input type="text" name="category" value={newGame.category} onChange={handleAddGameChange} style={inputStyle} required placeholder="e.g. Hand Therapy" />
                </div>
                <div>
                  <label style={labelStyle}>Difficulty Level</label>
                  <select name="difficulty_level" value={newGame.difficulty_level} onChange={handleAddGameChange} style={inputStyle}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Benefits (comma separated)</label>
                  <textarea name="benefits" value={newGame.benefits} onChange={handleAddGameChange} style={{...inputStyle, minHeight: '60px', resize: 'vertical'}} placeholder="e.g. Hand motor control, Focus, Speed"></textarea>
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea name="description" value={newGame.description} onChange={handleAddGameChange} style={{...inputStyle, minHeight: '80px', resize: 'vertical'}} required placeholder="Describe the game and its mechanics..."></textarea>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)', 
                    backgroundColor: 'transparent', 
                    color: 'var(--text-main)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <X size={16} /> Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px', 
                    border: 'none', 
                    backgroundColor: 'var(--primary)', 
                    color: '#fff',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <Save size={16} /> {isEditing ? 'Update Game' : 'Save Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {games.map(game => {
          const styles = getDifficultyStyles(game.difficulty_level);
          return (
            <div key={game.game_id} style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              opacity: game.is_active ? 1 : 0.6
            }}>
              {/* Header: Title and Difficulty */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{game.game_name}</h3>
                <span style={{
                  backgroundColor: styles.bg,
                  color: styles.color,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {game.difficulty_level || 'Normal'}
                </span>
              </div>

              <div style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {game.category}
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1, maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.description}</p>

              {/* Status Display */}
              <div style={{ marginBottom: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>Status:</span>
                <span style={{ 
                  color: game.is_active ? 'var(--success)' : 'var(--text-muted)', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold' 
                }}>
                  {game.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <button 
                  onClick={() => openEditModal(game)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    padding: '0.5rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.85rem'
                  }}>
                  <Edit size={14} /> Edit
                </button>
                <button 
                  onClick={() => toggleStatus(game.game_id, game.is_active)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    padding: '0.5rem', backgroundColor: game.is_active ? '#f59e0b' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'
                  }}>
                  <Power size={14} /> {game.is_active ? 'Hide' : 'Show'}
                </button>
                <button 
                  onClick={() => deleteGame(game.game_id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    padding: '0.5rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'
                  }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>

            </div>
          );
        })}
        {games.length === 0 && (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-muted)' }}>
             No games found in the database.
          </div>
        )}
      </div>

    </div>
  );
};

export default ManageGames;
