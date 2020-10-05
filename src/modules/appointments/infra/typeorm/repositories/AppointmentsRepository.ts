import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmenstsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IListAllInMonthAppointmentsDTO from '@modules/appointments/dtos/IListAllInMonthAppointmentsDTO';
import IListAllInDayAppointmentsDTO from '@modules/appointments/dtos/IListAllInDayAppointmentsDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentRepository implements IAppointmenstsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async listAllInMonth({ providerId, month, year }: IListAllInMonthAppointmentsDTO): Promise<Appointment[]> {

    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id: providerId,
        date: Raw(dateFieldName => `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`)
      }
    })

    return appointments;
  }

  public async listAllInDay({ providerId, day, month, year }: IListAllInDayAppointmentsDTO): Promise<Appointment[]> {

    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id: providerId,
        date: Raw(dateFieldName => `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`)
      }
    })

    return appointments;
  }

}

export default AppointmentRepository;
