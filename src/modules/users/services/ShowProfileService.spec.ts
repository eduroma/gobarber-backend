import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

let usersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('Update Profile', () => {

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(usersRepository)
  })

  it('should show user profile', async () => {

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johm.doe@test.com',
      password: 'password'
    })

    const profile = await showProfileService.execute({
      userId: user.id,
    })

    expect(profile.id).toBe(user.id);
    expect(profile.name).toBe(user.name);
    expect(profile.email).toBe(user.email)
  })


  it('should not show profile to invalid user', async () => {

    await expect(showProfileService.execute({
      userId: 'ivalid-user-is',
    })).rejects.toBeInstanceOf(AppError)

  })
});
