import { injectable, inject } from 'tsyringe';

import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import ISendEmailDTO from '@shared/container/providers/MailProvider/dtos/ISendEmailDTO';

@injectable()
export default class EtherealMailProvider implements IMailProvider {

  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then((account) => {

      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })

      this.client = transporter;
    })
  }

  public async sendEmail({ to, from, subject, templateData }: ISendEmailDTO): Promise<void> {

    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.address || 'contato@gobarber.com'
      },
      to: {
        name: to.name,
        address: to.address
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData)

    })

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
