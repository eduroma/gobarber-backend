import "reflect-metadata"

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let cacheProvider: FakeCacheProvider;

describe('List Provider Appointments', () => {

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    cacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(fakeAppointmentsRepository, cacheProvider)
  })

  it('should list provider appointments in a day', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 7, 15).getTime()
    })

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user1_id',
      date: new Date(2020, 9, 10, 14, 0, 0)
    })

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user2_id',
      date: new Date(2020, 9, 10, 16, 0, 0)
    })

    const appointments = await listProviderAppointmentsService.execute({
      providerId: 'provider_id',
      day: 10,
      month: 10,
      year: 2020
    })

    expect(appointments).toEqual([
      appointment1,
      appointment2
    ])
  })
});
