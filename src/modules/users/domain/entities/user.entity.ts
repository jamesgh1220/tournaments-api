export class User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;

  static create(
    name: string,
    email: string,
    password: string,
    role: string,
  ): User {
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role || 'team';
    return user;
  }
}
