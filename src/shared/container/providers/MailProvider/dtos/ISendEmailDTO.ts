import IPaseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string,
  address: string
}

export default interface ISendEmailDTO {
  to: IMailContact,
  from?: IMailContact,
  subject: string,
  templateData: IPaseMailTemplateDTO
}
