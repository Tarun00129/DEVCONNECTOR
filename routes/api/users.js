const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator');
const UserModel = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//@route   POST api/users
//@desc    Regester User
//@access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],async(req, res)=>{
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {   
        // See User is Already Exist
        let user = await UserModel.findOne({ email });
        if(user){
            return res.status(400).json({ errors: [{ msg: 'User Already Exist' }] });
        }

        // Get Users Gravtar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new UserModel({
            name,
            email,
            avatar,
            password
        });
        
        // Encrypt Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt)
        await user.save();

        // Return jsonwebtoken
        
        res.send('Regester User Route')
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;