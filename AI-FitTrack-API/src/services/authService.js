const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

async function register({ name, email, password }) {
  const existing = await User.findOne({ email });

  if (existing) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token: signToken(user._id.toString())
  };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token: signToken(user._id.toString())
  };
}

module.exports = { register, login };
