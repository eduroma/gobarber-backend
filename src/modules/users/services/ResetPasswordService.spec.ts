import "reflect-metadata"

import AppError from '@shared/errors/AppError';

import ResetPasswordService from './ResetPasswordService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider

let resetPassword: ResetPasswordService;

describe('Reset Password', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider)
  })

  it('should reset user password', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: '123456'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    await resetPassword.execute({ token, password: '123123' })

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toBeCalledWith('123123')
    expect(updatedUser?.password).toBe('123123')
  })

  it('should not be able to reset password with invalid token', async () => {

    await expect(resetPassword.execute({
      token: 'invalid-token',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset password with invalid user', async () => {

    const { token } = await fakeUserTokensRepository.generate('invalid-user-id')

    await expect(resetPassword.execute({
      token,
      password: '123123'
    })).rejects.toBeInstanceOf(AppError)

  })

  it('should not be able to reset password with expired token (2 hours)', async () => {

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: '123456'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(resetPassword.execute({
      token,
      password: '123123'
    })).rejects.toBeInstanceOf(AppError)

  })

})
