const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const UserModel = require('../../models/UserModel');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route   GET api/auth
//@desc    Test Token Middleware
//@access  Private
router.get('/', auth, async (req, res)=>{
    try {
        const user = await UserModel.findById(req.user.id).select('-password -__v');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route   POST api/auth
//@desc    Authenticate User and Get Token
//@access  Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
],async(req, res)=>{
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {   
        // See User is Already Exist
        let user = await UserModel.findOne({ email });
        if(!user){
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Check Password   
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }       
        
        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;