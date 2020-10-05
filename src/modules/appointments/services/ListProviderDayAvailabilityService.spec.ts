import "reflect-metadata"

import ListProviderDayAvaliabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

let listProviderDayAvailabilityService: ListProviderDayAvaliabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('List Provider Month Availability', () => {

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvaliabilityService(fakeAppointmentsRepository)
  })

  it('should list provider available hours in a day', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 2, 11).getTime()
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 14, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 2, 16, 0, 0)
    })

    const providerAvailability = await listProviderDayAvailabilityService.execute({
      providerId: 'provider_id',
      day: 2,
      month: 5,
      year: 2020
    })

    expect(providerAvailability).toEqual(expect.arrayContaining([
      { hour: 8, available: false },
      { hour: 9, available: false },
      { hour: 10, available: false },
      { hour: 11, available: false },
      { hour: 12, available: true },
      { hour: 14, available: false },
      { hour: 15, available: true },
      { hour: 16, available: false },
    ]))
  })
});
