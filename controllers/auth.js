const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors');
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const register = async (req, res) => {

    // const { name, email, password } = req.body;
    // //encrypting the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedpassword = await bcrypt.hash(password, salt);

    // const tempUser = { name, email, password: hashedpassword };
    // const user = await User.create({ ...tempUser })

    const user = await User.create({ ...req.body })
    // generating token from controllers
    // const token = jwt.sign({ userId: user._id, name: user.name }, 'jwtSecret', {
    //     expiresIn: '30d'
    // })

    //generating token using mongoose(instance method)
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email });
    //compare password  
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPaswordCorrect = await user.comparePassword(password)
    if (!isPaswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login
}