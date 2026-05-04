const express = require('express')
const app = express()
const port = 3000
const registerQuery = require('./query/register_query');
const loginQuery = require('./query/login_query');
const { getUsersQuery, showUserQuery, updateUserQuery } = require('./query/users');
const { getAllUsers, updateUser, deleteUser } = require('./query/admin_users');
const authUserQuery = require('./query/auth_user');
const adminLoginQuery = require('./query/admin_login_query');
const adminRegisterQuery = require('./query/admin_register_query');
const { getAllGamesAdmin, toggleGameStatus, addGame, editGame, deleteGame } = require('./query/admin_games');
const getActiveGames = require('./query/games');
const { getUserProgress } = require('./query/progress_query');
const { getAdminDashboardStats } = require('./query/admin_dashboard_query');
const { saveGameSession } = require('./query/game_sessions_query');
const authMiddleware = require('./middleware/authMiddleware');
const cors = require('cors');

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => res.send('Hello World!'))



app.post('/register',registerQuery);

app.post('/login',loginQuery);

app.post('/admin/register',adminRegisterQuery);

app.post('/admin/login',adminLoginQuery);

app.get('/admin/users', getAllUsers);

app.put('/admin/users/:id', updateUser);

app.delete('/admin/users/:id', deleteUser);

app.get('/admin/games', getAllGamesAdmin);

app.post('/admin/games', addGame);

app.put('/admin/games/:id', editGame);

app.put('/admin/games/:id/status', toggleGameStatus);

app.delete('/admin/games/:id', deleteGame);

app.get('/games', getActiveGames);

app.get('/auth/me', authMiddleware, authUserQuery);

app.get('/users', authMiddleware, getUsersQuery);

app.put('/users/profile', authMiddleware, updateUserQuery);

app.get('/users/:email', authMiddleware, showUserQuery);

app.get('/users/progress/stats', authMiddleware, getUserProgress);

app.post('/game_sessions', authMiddleware, saveGameSession);

app.get('/admin/stats/dashboard', getAdminDashboardStats);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))