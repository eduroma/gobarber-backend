import { getRepository, Repository, Not } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IListProvidersDTO from '@modules/users/dtos/IListProvidersDTO';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async listAllProviders({ exceptUserId }: IListProvidersDTO): Promise<User[]> {
    if (exceptUserId) {
      return this.ormRepository.find({
        where: {
          id: Not(exceptUserId)
        }
      })
    }
    return this.ormRepository.find();
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    await this.ormRepository.save(user);

    return user;
  }
}

export default UsersRepository;
