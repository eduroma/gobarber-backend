import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  exceptUserId: string
}

@injectable()
export default class ListProviderService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) { }

  public async execute({ exceptUserId }: IRequest): Promise<User[]> {

    let providers = await this.cacheProvider.recover<User[]>(`providers-list:${exceptUserId}`)

    if (!providers) {
      providers = await this.usersRepository.listAllProviders({
        exceptUserId
      });

      await this.cacheProvider.save(`providers-list:${exceptUserId}`, providers)
    }

    return providers
  }

}

