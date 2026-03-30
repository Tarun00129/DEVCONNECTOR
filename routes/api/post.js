const express = require('express')
const router = express.Router();

//@route   api/post
//@desc    Test Route
//@access  Public
router.get('/',(req, res)=>res.send('Test Post Route'));

module.exports = router;