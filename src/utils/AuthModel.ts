
interface UserStore {
    [email: string]: string;
  }
  
  const AuthModel = {
    users: {} as UserStore,
  
    addUser(email: string, password: string): boolean {
      if (this.users[email]) return false;
      this.users[email] = password;
      return true;
    },
  
    userExists(email: string): boolean {
      return !!this.users[email];
    },
  
    validateUser(email: string, password: string): boolean {
      return this.users[email] === password;
    }
  };
  
  export default AuthModel;
  