import { inject, injectable } from 'tsyringe';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export default class ListProviderAppointmentsService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) { }

  public async execute({ providerId, day, month, year }: IRequest): Promise<Appointment[]> {

    const appointments = await this.appointmentsRepository.listAllInDay({
      providerId,
      day,
      month,
      year
    })
    return appointments;
  }
}

