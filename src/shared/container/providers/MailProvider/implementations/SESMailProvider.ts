import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import ISendEmailDTO from '@shared/container/providers/MailProvider/dtos/ISendEmailDTO';

import mailConfig from '@config/mail';

@injectable()
export default class SESMailProvider implements IMailProvider {

  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {

    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01'
      })
    })
  }

  public async sendEmail({ to, from, subject, templateData }: ISendEmailDTO): Promise<void> {

    const { name, email } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.address || email
      },
      to: {
        name: to.name,
        address: to.address
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData)

    })
  }
}
