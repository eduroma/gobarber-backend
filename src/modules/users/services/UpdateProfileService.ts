
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  userId: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider

  ) { }

  public async execute({ userId, name, email, password, oldPassword }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Permision denied to update avatar!', 401);
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== userId) {
      throw new AppError('Email already in use!');
    }

    if (password && !oldPassword) {
      throw new AppError('Old password not provided!');
    }

    if (password && oldPassword) {

      const oldPasswordCheck = await this.hashProvider.compareHash(oldPassword, user.password)

      if (!oldPasswordCheck) {
        throw new AppError('Old password doesn`t match!');
      }

      user.password = await this.hashProvider.generateHash(password)
    }

    user.name = name;
    user.email = email;

    return this.usersRepository.save(user);
  }

}

export default UpdateProfileService;
