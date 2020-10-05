import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import UploadUserAvatarService from './UploadUserAvatarService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'

let usersRepository: FakeUsersRepository;
let storageProvider: FakeStorageProvider;
let uploadUserAvatar: UploadUserAvatarService;

describe('UploadUserAvatar', () => {

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    storageProvider = new FakeStorageProvider();
    uploadUserAvatar = new UploadUserAvatarService(usersRepository, storageProvider)
  })

  it('should upload avatar to an user', async () => {

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johm.doe@test.com',
      password: 'password'
    })

    await uploadUserAvatar.execute({
      userId: user.id,
      avatarFileName: 'avatar.png'
    })

    expect(user.avatar).toBe('avatar.png')
  })

  it('should not upload avatar to an invalid user', async () => {

    await expect(uploadUserAvatar.execute({
      userId: 'invalidUserId',
      avatarFileName: 'avatar.png'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should delete old avatar on upload a new one', async () => {

    const deleteFile = jest.spyOn(storageProvider, 'deleteFile')

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johm.doe@test.com',
      password: 'password'
    })

    await uploadUserAvatar.execute({
      userId: user.id,
      avatarFileName: 'avatar1.png'
    })

    await uploadUserAvatar.execute({
      userId: user.id,
      avatarFileName: 'avatar2.png'
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar1.png')
    expect(user.avatar).toBe('avatar2.png')
  })

})
