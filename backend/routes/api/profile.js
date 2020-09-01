const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');


const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET api/profile/me
// @desc    Get Current User's Profile
// @access  PRIVATE
router.get('/me', auth, async (req, res) => {
    try
    {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);

        if (!profile)
            return res.status(400).json({msg:'Profile Not Found!'});

        
        res.json(profile);
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

// @route   POST api/profile/me
// @desc    Create/Update User Profile
// @access  PRIVATE
router.post('/me', [auth, [
    check('status', 'Status required!').not().isEmpty(),
    check('skills', 'Skills required!').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills)
    {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try
    {
        let profile = await Profile.findOne({user: req.user.id});

        if (profile)
        {
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new:true});
            return res.json(profile);
        }
        
        profile = new Profile(profileFields);

        await profile.save();

        res.json(profile);

    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

// @route   GET api/profile
// @desc    Get All Profiles
// @access  PUBLIC
router.get('/', async (req, res) => {
    try
    {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    }
    catch (error) 
    {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

// @route   GET api/profile/user/:id
// @desc    Get Profile By User ID
// @access  PUBLIC
router.get('/user/:id', async (req, res) => {
    try
    {
        const profile = await Profile.findOne({user: req.params.id}).populate('user', ['name', 'avatar']);

        if (!profile) 
            return res.status(400).json({msg: 'Profile not found!'});

        res.json(profile);
    }
    catch(error)
    {
        console.error(error.message);

        if (error.kind == 'ObjectId')
            return res.status(400).json({msg: 'Profile not found!'});

        res.status(500).send('Server Error!');
    }
});

// @route   DELETE api/profile
// @desc    Delete User, Profile & Posts
// @access  PRIVATE
router.delete('/', auth, async (req, res) => {
    try
    {
        await Profile.findOneAndDelete({user: req.user.id});
        
        await User.findOneAndDelete({_id: req.user.id});

        res.json({msg:'Deleted!'});
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

// @route   PUT api/profile/experience
// @desc    Add Profile Experience
// @access  PRIVATE
router.put('/experience', [auth, [
    check('title', 'Title required!').not().isEmpty(),
    check('company', 'Company required!').not().isEmpty(),
    check('from', 'From Date required!').not().isEmpty(),

]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(400).json({errors:errors.array()});

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const experience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try
    {
        const profile = await Profile.findOne({user: req.user.id});

        profile.experience.unshift(experience);

        await profile.save();
        
        res.json(profile);
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
})

module.exports = router;