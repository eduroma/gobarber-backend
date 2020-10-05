import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let usersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('List Providers', () => {

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(usersRepository)
  })

  it('should list providers', async () => {

    const user1 = await usersRepository.create({
      name: 'John Doe',
      email: 'johm.doe@test.com',
      password: 'password'
    })

    const user2 = await usersRepository.create({
      name: 'Walter White',
      email: 'walter@white.com',
      password: 'password'
    })

    const loggedUser = await usersRepository.create({
      name: 'Michael Corleone',
      email: 'michael@corleone.com',
      password: 'password'
    })

    const providers = await listProvidersService.execute({
      exceptUserId: loggedUser.id
    })

    expect(providers).toEqual([user1, user2]);
  })
});
