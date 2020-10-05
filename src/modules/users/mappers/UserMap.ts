import User from '@modules/users/infra/typeorm/entities/User';

export default class UserMap {
  public static toDTO({
    id,
    name,
    email,
    avatar,
    created_at,
    updated_at,
  }: User): Omit<User, 'password'> {
    return {
      id,
      name,
      email,
      avatar,
      created_at,
      updated_at,
    };
  }
}
