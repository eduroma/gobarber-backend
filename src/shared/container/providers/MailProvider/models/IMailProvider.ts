import ISendEmailDTO from '@shared/container/providers/MailProvider/dtos/ISendEmailDTO';

export default interface IModelProvider {
  sendEmail(data: ISendEmailDTO): Promise<void>;
}
