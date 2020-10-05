import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IListAllInMonthAppointmentsDTO from '@modules/appointments/dtos/IListAllInMonthAppointmentsDTO';
import IListAllInDayAppointmentsDTO from '@modules/appointments/dtos/IListAllInDayAppointmentsDTO';

interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  listAllInMonth(data: IListAllInMonthAppointmentsDTO): Promise<Appointment[]>;
  listAllInDay(data: IListAllInDayAppointmentsDTO): Promise<Appointment[]>;
}

export default IAppointmentsRepository;
