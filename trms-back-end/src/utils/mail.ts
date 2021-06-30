/* eslint-disable max-len */
import dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import log from '../log';

dotenv.config({});

/** This is not an exhaustive list */
interface Options {
  /** The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>' */
  from?: string;
  /** An e-mail address that will appear on the Sender: field */
  sender?: string;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the To: field */
  to?: string;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field */
  cc?: string;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field */
  bcc?: string;
  /** The subject of the e-mail */
  subject?: string;
  /** The plaintext version of the message */
  text?: string | Buffer;
  /** The HTML version of the message */
  html?: string | Buffer;
  /** iCalendar event, same usage as with text and html. Event method attribute defaults to ‘PUBLISH’ or define it yourself: {method: 'REQUEST', content: iCalString}. This value is added as an additional alternative to html or text. Only utf-8 content is allowed */
  icalEvent?: string | Buffer;
  /** An array of attachment objects */
  attachments?: [];
  /** optional Date value, current UTC string will be used if not set */
  date?: Date | string;
  priority?: 'high' | 'normal' | 'low';
}

export default class Mail {
  private static transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  private static from = `"TRMS👻" <${process.env.MAIL_USERNAME}>`;

  public static async send(to: string, subject: string, text: string, html: string) {
    return Mail.sendMail({
      from: Mail.from,
      to,
      subject,
      text,
      html,
      priority: 'high',
    });
  }

  public static async sendMail(
    mailOptions: Options,
  ): Promise<SMTPTransport.SentMessageInfo | null> {
    if (process.env.SEND_MAIL) {
      try {
        const info = await Mail.transporter.sendMail(mailOptions);
        log.debug('Message sent:', JSON.stringify(info));
        return info;
      } catch (err) {
        log.error(err);
      }
    } else {
      log.debug('Mail service is not enabled, set SEND_MAIL to true in the environment variables.');
    }

    return null;
  }
}
