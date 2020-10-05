
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let usersRepository: FakeUsersRepository
let hashProvider: FakeHashProvider
let createUser: CreateUserService
let authenticateUser: AuthenticateUserService

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    createUser = new CreateUserService(usersRepository, hashProvider);
    authenticateUser = new AuthenticateUserService(usersRepository, hashProvider)
  })

  it('should authenticate an user', async () => {

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: '123456'
    })

    const auth = await authenticateUser.execute({
      email: user.email,
      password: user.password
    })

    expect(auth).toHaveProperty('token');
    expect(auth.user).toEqual(user);
  })

  it('should not authenticate an invalid user', async () => {

    await expect(authenticateUser.execute({
      email: 'john.doe@test.com',
      password: 'password'
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should not authenticate an user with wrong password', async () => {

    const userData = {
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: 'password'
    }

    await createUser.execute(userData)

    await expect(authenticateUser.execute({
      email: userData.email,
      password: 'wrongPassword'
    })).rejects.toBeInstanceOf(AppError);

  })

})
