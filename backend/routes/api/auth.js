const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Register New User
// @access  PRIVATE
router.get('/', auth, async (req, res) => {
    try
    {
        const user = await User.findById(req.user.id).select('-password');

        res.json(user)


    }
    catch (error)
    {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

// @route   POST api/auth
// @desc    Get Logged In User's Token
// @access  PUBLIC
router.post('/', [
    check('email', 'Email required!').isEmail(),
    check('password', 'Password required!').exists()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }

    let {email, password} = req.body;

    try 
    {
        let user = await User.findOne({email});

        if (!user)
            return res.status(400).json({errors:[{msg:'Invalid Credentials!'}]});


        const passwordAccepted = await bcryptjs.compare(password, user.password);

        if (!passwordAccepted)
            return res.status(400).json({errors:[{msg:'Invalid Credentials!'}]});


        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload, 
            config.get('jwtSecret'), 
            {expiresIn: 3600000000000},
            (error, token) => {
                if (error) throw error;
                
                return res.status(200).json({token})
            }    
        );
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

module.exports = router;