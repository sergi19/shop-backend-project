const express = require('express');
const { tokenVerification, roleAdminVerification } = require('../middlewares/authentication');
const app = express();
const User = require('../models/user');