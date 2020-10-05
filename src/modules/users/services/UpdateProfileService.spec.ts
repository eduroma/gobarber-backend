import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';


let hashProvider: FakeHashProvider;
let usersRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;

describe('Update Profile', () => {

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(usersRepository, hashProvider)
  })

  it('should update an user profile', async () => {

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johm.doe@test.com',
      password: 'password'
    })

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name: 'João das Neves',
      email: 'joao@neves.com.br'
    })

    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.name).toBe('João das Neves');
    expect(updatedUser.email).toBe('joao@neves.com.br')
  })

  it('should not be able to update profile with an email used by another user', async () => {

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: 'password'
    })

    const user = await usersRepository.create({
      name: 'João das Neves',
      email: 'joao@neves.com.br',
      password: 'password'
    })

    await expect(updateProfileService.execute({
      userId: user.id,
      name: 'João das Neves Filho',
      email: 'john.doe@test.com'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update password', async () => {

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: 'password'
    })

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name: user.name,
      email: user.email,
      oldPassword: 'password',
      password: 'new_password'
    })

    expect(updatedUser.password).toBe('new_password')
  })

  it('should not be able to update password if not provide old password', async () => {

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: 'password'
    })

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: user.name,
        email: user.email,
        password: 'new_password'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update password if old password doesn`t match', async () => {

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: 'password'
    })

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: user.name,
        email: user.email,
        oldPassword: '123456',
        password: 'new_password'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update profile to invalid user', async () => {

    await expect(
      updateProfileService.execute({
        userId: 'invalid-user-id',
        name: 'Invalid User',
        email: 'invalid@user.com',
      })
    ).rejects.toBeInstanceOf(AppError)

  })


})
