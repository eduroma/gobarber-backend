import { Request, Response } from 'express'
import { container } from 'tsyringe';

import UploadUserAvatarService from '@modules/users/services/UploadUserAvatarService';

import UserMap from '@modules/users/mappers/UserMap';

export default class UserAvatarController {

  public async update(request: Request, response: Response): Promise<Response> {

    const uploadUserAvatar = container.resolve(UploadUserAvatarService);

    const user = await uploadUserAvatar.execute({
      userId: request.user.id,
      avatarFileName: request.file.filename,
    });

    const mappedUser = UserMap.toDTO(user);

    return response.json(mappedUser);
  }

}
