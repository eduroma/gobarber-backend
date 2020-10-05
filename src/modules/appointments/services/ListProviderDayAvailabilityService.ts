import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean
}>

@injectable()
export default class ListProviderDayAvailabilityService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) { }

  public async execute({ providerId, day, month, year }: IRequest): Promise<IResponse> {

    const appointments = await this.appointmentsRepository.listAllInDay({
      providerId,
      day,
      month,
      year
    })

    const startHour = 8;

    const hoursInDay = Array.from(
      { length: 10 },
      (_, index) => index + startHour
    )

    const currentDate = new Date(Date.now())

    const availability = hoursInDay.map(hour => {

      const appointmentsInHour = appointments.find(appointment => (
        getHours(appointment.date) === hour
      ));

      const compareDate = new Date(year, month - 1, day, hour)

      return {
        hour,
        available: !appointmentsInHour && isAfter(compareDate, currentDate)
      }
    })
    return availability;
  }

}

