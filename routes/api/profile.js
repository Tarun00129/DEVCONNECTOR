const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const UserModel = require('../../models/UserModel');
const {check, validationResult} = require('express-validator');
const ProfileModel = require('../../models/ProfileModel');

//@route   GET api/profile/me
//@desc    Get current users profile
//@access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await ProfileModel.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route   POST api/profile
//@desc    Create or update user profile
//@access  Private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
        school,
        degree,
        fieldofstudy,
        title,
        from,
        to,
        current,
        experience_description,
        education_description
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;      

    // Build experience object
    profileFields.experience = {};
    if (title) profileFields.experience.title = title;
    if (company) profileFields.experience.company = company;
    if (location) profileFields.experience.location = location;
    if (from) profileFields.experience.from = from;
    if (to) profileFields.experience.to = to;
    if (current) profileFields.experience.current = current;
    if (experience_description) profileFields.experience.experience_description = experience_description;

    // Build education object
    profileFields.education = {};
    if (school) profileFields.education.school = school;
    if (degree) profileFields.education.degree = degree;
    if (fieldofstudy) profileFields.education.fieldofstudy = fieldofstudy;
    if (from) profileFields.education.from = from;
    if (to) profileFields.education.to = to;
    if (current) profileFields.education.current = current;
    if (education_description) profileFields.education.education_description = education_description;

    // Save profile
    try {
        let profile = await ProfileModel.findOne({ user: req.user.id });    
        if (profile) {
            // Update
            profile = await ProfileModel.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { returnDocument: 'after' }
            );
            return res.json({profile, msg: 'Profile Updated Successfully'});
        }
        // Create
        profile = new ProfileModel(profileFields);
        await profile.save();
        res.json({profile, msg: 'Profile Created Successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public  
router.get('/', async(req, res)=>{
    try {
        const profiles = await ProfileModel.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public  
router.get('/user/:user_id', async(req, res)=>{
    try {
        const profile = await ProfileModel.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Profile not found 2' });
        }
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;