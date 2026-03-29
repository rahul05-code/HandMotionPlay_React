const express = require('express')
const app = express()
const port = 3000
const registerQuery = require('./query/register_query');
const loginQuery = require('./query/login_query');
const { getUsersQuery, showUserQuery, updateUserQuery } = require('./query/users');
const authUserQuery = require('./query/auth_user');
const authMiddleware = require('./middleware/authMiddleware');
const cors = require('cors');

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => res.send('Hello World!'))



app.post('/register',registerQuery);

app.post('/login',loginQuery);

app.get('/auth/me', authMiddleware, authUserQuery);

app.get('/users', authMiddleware, getUsersQuery);

app.put('/users/profile', authMiddleware, updateUserQuery);

app.get('/users/:id', authMiddleware, showUserQuery);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))