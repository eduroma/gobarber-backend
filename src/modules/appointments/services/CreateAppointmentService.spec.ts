import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

import CreateAppointmentService from './CreateAppointmentService';

let appointmentsRepository: FakeAppointmentsRepository
let notificationsRepository: FakeNotificationsRepository

let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {

  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    notificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(appointmentsRepository, notificationsRepository);
  })

  it('should be able to create an appointment', async () => {

    const provider_id = 'provider_id';
    const user_id = 'user_id'
    const date = new Date(2020, 1, 7, 16);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 7, 15).getTime()
    })

    const appointment = await createAppointment.execute({
      provider_id,
      user_id,
      date
    })

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
    expect(appointment.date).toEqual(startOfHour(date))
  })

  it('should not be able to create an appointment in same hour', async () => {

    const provider_id = 'provider_id';
    const user_id = 'user_id'
    const date = new Date(2020, 1, 7, 16);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 1, 7, 15).getTime()
    })

    await createAppointment.execute({
      provider_id,
      user_id,
      date
    })

    await expect(createAppointment.execute({
      provider_id,
      user_id,
      date
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment in past date', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 7, 15).getTime()
    })

    await expect(createAppointment.execute({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 1, 7, 13)
    })).rejects.toBeInstanceOf(AppError)

  })

  it('should not be able to create an appointment to the same user and provider', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 7, 15).getTime()
    })

    await expect(createAppointment.execute({
      provider_id: 'provider_id',
      user_id: 'provider_id',
      date: new Date(2020, 1, 7, 16)
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment before 8am or after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 1, 7, 15).getTime()
    })

    await expect(createAppointment.execute({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 1, 8, 7)
    })).rejects.toBeInstanceOf(AppError)

    await expect(createAppointment.execute({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 1, 8, 18)
    })).rejects.toBeInstanceOf(AppError)

  })

})
