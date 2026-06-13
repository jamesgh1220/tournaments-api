import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // se guarda hasheada con bcrypt

  @Column()
  role: string; // 'team' | 'admin'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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
