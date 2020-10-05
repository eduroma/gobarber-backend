import { v4 } from 'uuid'
import { isEqual, getYear, getMonth, getDate } from 'date-fns';

import IAppointmenstsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IListAllInMonthAppointmentsDTO from '@modules/appointments/dtos/IListAllInMonthAppointmentsDTO';
import IListAllInDayAppointmentsDTO from '@modules/appointments/dtos/IListAllInDayAppointmentsDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentRepository implements IAppointmenstsRepository {

  private appointments: Appointment[] = [];

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {

    const appointment = new Appointment();

    Object.assign(appointment, { id: v4(), provider_id, user_id, date })

    this.appointments.push(appointment)

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {

    const findAppointment = this.appointments.find(appointment => isEqual(appointment.date, date));

    return findAppointment;
  }

  public async listAllInMonth({ providerId, month, year }: IListAllInMonthAppointmentsDTO): Promise<Appointment[]> {

    const appointments = this.appointments.filter(appointment =>
      appointment.provider_id === providerId &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year
    )

    return appointments;
  }

  public async listAllInDay({ providerId, day, month, year }: IListAllInDayAppointmentsDTO): Promise<Appointment[]> {

    const appointments = this.appointments.filter(appointment =>
      appointment.provider_id === providerId &&
      getDate(appointment.date) === day &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year
    )

    return appointments;
  }


}
export default AppointmentRepository;
