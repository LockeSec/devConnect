const jwt = require('jwt');
const config = require('config');

const verifyToken = (req, res, next) => {

    const token = req.header('x-auth-token');

    if (!token)
        return res.status(401).json({msg:'Unauthorized'});

    try 
    {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        
    }
    catch(error)
    {
    
    }
}   

module.exports = verifyToken;