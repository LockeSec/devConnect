const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register New User
// @access  PUBLIC
router.post('/', [
    check('name', 'Name required!').not().isEmpty(),
    check('email', 'Email required!').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
], async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }

    let {name, email, password} = req.body;

    try 
    {
        let user = await User.findOne({email});

        if (user)
            return res.status(400).json({errors:[{msg:'User already exists!'}]});

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        const salt = await bcryptjs.genSalt(10);
        password = await bcryptjs.hash(password, salt);

        user = new User({
            name,
            email,
            avatar,
            password,
        });

        await user.save();

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
        next(error);
    }
});

module.exports = router;
