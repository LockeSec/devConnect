const express = require('express');

const app = express();

const connectDatabase = require('./config/db');
connectDatabase();

app.get('/', (req, res) => {
    res.send('Hello world!!!');
});

app.use(express.json());

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});