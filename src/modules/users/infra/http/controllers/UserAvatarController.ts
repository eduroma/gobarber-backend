import { Request, Response } from 'express'
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer'

import UploadUserAvatarService from '@modules/users/services/UploadUserAvatarService';

export default class UserAvatarController {

  public async update(request: Request, response: Response): Promise<Response> {

    const uploadUserAvatar = container.resolve(UploadUserAvatarService);

    const user = await uploadUserAvatar.execute({
      userId: request.user.id,
      avatarFileName: request.file.filename,
    });

    return response.json(classToClass(user));
  }

}
