import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean
}>

@injectable()
export default class ListProviderMonthAvailabilityService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) { }

  public async execute({ providerId, month, year }: IRequest): Promise<IResponse> {

    const appointments = await this.appointmentsRepository.listAllInMonth({
      providerId,
      month,
      year
    })

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const daysInMonth = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1
    )

    const availability = daysInMonth.map(day => {

      const appointmentsInDay = appointments.filter(appointment => (
        getDate(appointment.date) === day
      ));

      return {
        day,
        available: appointmentsInDay.length < 10
      }
    })
    return availability;
  }

}

