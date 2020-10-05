import { getRepository, Repository } from 'typeorm';

import UserTokens from '@modules/users/infra/typeorm/entities/UserTokens';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserTokens>;

  constructor() {
    this.ormRepository = getRepository(UserTokens);
  }

  public async findByToken(token: string): Promise<UserTokens | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: {
        token
      }
    });

    return userToken;
  }

  public async generate(user_id: string): Promise<UserTokens> {

    const userToken = this.ormRepository.create({
      user_id
    })

    await this.ormRepository.save(userToken)

    return userToken;

  }

}

export default UserTokensRepository;
