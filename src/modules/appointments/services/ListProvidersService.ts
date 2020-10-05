import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  exceptUserId: string
}

@injectable()
export default class ListProviderService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) { }

  public async execute({ exceptUserId }: IRequest): Promise<User[]> {

    const providers = await this.usersRepository.listAllProviders({
      exceptUserId
    });

    return providers
  }

}

