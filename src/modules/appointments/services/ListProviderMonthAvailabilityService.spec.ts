import "reflect-metadata"

import ListProviderMonthAvaliabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

let listProviderMonthAvailabilityService: ListProviderMonthAvaliabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('List Provider Month Availability', () => {

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvaliabilityService(fakeAppointmentsRepository)
  })

  it('should list provider available days in a month', async () => {

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 8, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 9, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 10, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 11, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 12, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 13, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 14, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 15, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 16, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 17, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 4, 8, 0, 0)
    })

    const providerAvailability = await listProviderMonthAvailabilityService.execute({
      providerId: 'provider_id',
      month: 5,
      year: 2020
    })

    expect(providerAvailability).toEqual(expect.arrayContaining([
      { day: 1, available: true },
      { day: 2, available: false },
      { day: 3, available: true },
      { day: 4, available: true },
    ]))

  })
});
