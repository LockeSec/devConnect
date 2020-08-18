const express = require('express');

const app = express();

const connectDatabase = require('./config/db');
connectDatabase();

app.get('/', (req, res) => {
    res.send('Hello world!!!');
});

app.use(express.json());

app.use('/api/users', require('./routes/api/users'));

const errorHandling = require('./middleware/errorHandling');
app.use(errorHandling.routeNotFound);
app.use(errorHandling.errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});