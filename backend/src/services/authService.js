const User = require('../models/User');
const generateToken = require('../utils/generateToken');

class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password, role }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Authenticate user login
   */
  async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Account is deactivated. Please contact administrator.');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Get authenticated user profile
   */
  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Change user password
   */
  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      const error = new Error('Ancien mot de passe incorrect');
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Mot de passe modifié avec succès' };
  }
}

module.exports = new AuthService();
