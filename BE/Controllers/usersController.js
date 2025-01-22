// usersController.js

import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { User } from '../models/user.js'; // Import the User model

// Constants
const SALT_ROUNDS = 10;


// Login User
export const loginUser = async (req, res) => {
  const { email: userEmail, password: userPassword } = req.body;

  try {
    // Validate input
    if (!userEmail || !userPassword) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare the plaintext password with the hashed password
    const isPasswordValid = await bcrypt.compare(userPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    // Successful login, return the user object (excluding password)
    const { id, name, email, account_type, student_number } = user;
    res.status(200).json({ id, name, email, account_type, student_number });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get All Users
export const getAllUsersFromDB = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get All User Names
export const getAllUsersNamesFromDB = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['name'] });
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get User by ID
export const getUsersFromDBById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: `User with id ${req.params.userId} not found` });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Insert New User
export const insertUsersIntoDB = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Update User by ID
export const updateUsersById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (user) {
      const updatedUser = await user.update(req.body);
      return res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ error: `User with id ${req.params.userId} not found` });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete User by ID
export const deleteUsers = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (user) {
      await user.destroy();
      return res.status(200).json({ message: 'User deleted successfully!' });
    } else {
      return res.status(404).json({ error: `User with id ${req.params.userId} not found` });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Filter Users
export const filterUsersFromDB = async (req, res) => {
  try {
    const { account_type } = req.query;
    const whereClause = account_type ? { account_type } : {};

    const users = await User.findAll({ where: whereClause });
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};
