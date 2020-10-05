import { Request, Response } from 'express'
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

import UserMap from '@modules/users/mappers/UserMap';

export default class ProfileController {

  public async show(request: Request, response: Response): Promise<Response> {

    const userId = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const profile = await showProfile.execute({ userId })

    const mappedUser = UserMap.toDTO(profile);

    return response.json(mappedUser);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, oldPassword, password } = request.body;
    const userId = request.user.id;

    const updateProfile = container.resolve(UpdateProfileService);

    const profile = await updateProfile.execute({
      userId,
      name,
      email,
      oldPassword,
      password,
    });

    const mappedUser = UserMap.toDTO(profile);

    return response.json(mappedUser);
  }

}
