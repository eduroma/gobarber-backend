import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import ISendEmailDTO from '@shared/container/providers/MailProvider/dtos/ISendEmailDTO';

export default class FakeMailProvider implements IMailProvider {

  private messages: ISendEmailDTO[] = [];

  public async sendEmail(data: ISendEmailDTO): Promise<void> {

    this.messages.push(data)
  }

}
