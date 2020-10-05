import { Request, Response } from 'express'
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer'

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';


export default class ProfileController {

  public async show(request: Request, response: Response): Promise<Response> {

    const userId = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const profile = await showProfile.execute({ userId })

    return response.json(classToClass(profile));
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

    return response.json(classToClass(profile));
  }

}
