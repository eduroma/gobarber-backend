import "reflect-metadata"

import AppError from '@shared/errors/AppError';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;
let fakeUserTokensRepository: FakeUserTokensRepository;

describe('Send Forgot Password Email', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository);
  })

  it('should send an email when user forgot password', async () => {

    const sendMail = jest.spyOn(fakeMailProvider, 'sendEmail')

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: '123456'
    })

    await sendForgotPasswordEmail.execute({ email: 'john.doe@test.com' })

    expect(sendMail).toHaveBeenCalled();

  })

  it('should not send an email when user is invalid', async () => {

    await expect(sendForgotPasswordEmail.execute({ email: 'john.doe@test.com' })).rejects.toBeInstanceOf(AppError)

  })

  it('should generate a token', async () => {

    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: '123456'
    })

    await sendForgotPasswordEmail.execute({ email: 'john.doe@test.com' })

    expect(generateToken).toHaveBeenCalledWith(user.id)
  })

})
