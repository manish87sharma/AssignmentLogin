const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUserSignUp, validateUserLogin } = require('../models/user');
const express = require('express');
const router = express.Router();
const db = require('../startup/db');
const { promisify } = require('util');
const ComparePassword = promisify(bcrypt.compare);

/* GET users listing. */
router.get('/login', async (req, res) => {
  // res.send('respond with a resource');
  console.log("params", req.query);
  const { error } = validateUserLogin(req.query);
  if (error) return res.status(400).send(error.details[0].message);

  let isUserExist = await db.getPassword(req.query.UserName);
  if (!isUserExist.length) return res.status(400).send('User not exist, Kindly registered first.');
  let result = await ComparePassword(req.query.Password, isUserExist[0].Password)
  if (result) {
    res.status(200).send(`User login successful `);
  } else {
    res.status(401).send(`User login failed `);
  }
});

router.post('/signup', async (req, res) => {
  const { error } = validateUserSignUp(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let isUserExist = await db.getPassword(req.body.UserName);
  if (isUserExist.length) return res.status(400).send('User already registered.');

  let { UserName, Password, Email, FirstName, LastName, Country, Gender } = req.body;
  const salt = await bcrypt.genSalt(10);
  Password = await bcrypt.hash(Password, salt);
  let result = await db.addUserDetails(UserName, Password, Email, FirstName, LastName, Country, Gender);
  if (result)
    res.send(`User added ${UserName}`);
  // const token = user.generateAuthToken();
  // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});


module.exports = router;
