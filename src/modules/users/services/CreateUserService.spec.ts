import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let usersRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let createUser: CreateUserService;
let cacheProvider: FakeCacheProvider;

describe('Create Users', () => {

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    cacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(usersRepository, hashProvider, cacheProvider);

  })

  it('should create a new user', async () => {

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: '123456'
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a user with an existing email', async () => {

    const user1 = {
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: '123456'
    }

    const user2 = {
      name: 'Foo Bar',
      email: 'john.doe@test.com',
      password: '123456789'
    }

    await createUser.execute(user1)

    await expect(createUser.execute(user2)).rejects.toBeInstanceOf(AppError);

  })
})
