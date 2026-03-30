const express = require('express')
const router = express.Router();

//@route   api/auth
//@desc    Test Route
//@access  Public
router.get('/',(req, res)=>res.send('Test Auth Route'));

module.exports = router;