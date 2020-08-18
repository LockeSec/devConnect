const mongoose = require('mongoose');
const config = require('config');

const connectDatabase = async () => {
    try 
    {
        await mongoose.connect(config.get('mongoURI'), {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected!!!');
    }
    catch (error)
    {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDatabase;