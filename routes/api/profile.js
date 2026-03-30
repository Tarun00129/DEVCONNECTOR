const express = require('express')
const router = express.Router();

//@route   api/profile
//@desc    Test Route
//@access  Public
router.get('/',(req, res)=>res.send('Test Profile Route'));

module.exports = router;