
import { authAPI } from '../services/api';

const AuthModel = {
  async addUser(email: string, password: string): Promise<boolean> {
    try {
      await authAPI.register(email, password);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  },

  async userExists(email: string): Promise<boolean> {
    // For registration, we'll let the backend handle duplicate checking
    // This method is mainly for UI feedback
    return false;
  },

  async validateUser(email: string, password: string): Promise<boolean> {
    try {
      await authAPI.login(email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }
};

export default AuthModel;
  