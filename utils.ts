import { MessageAttachment } from '@slack/client';
import util from 'util';
import { Snitch, WebhookPayload } from './interfaces';

export const parsePayload = (body: string | null): WebhookPayload => {
  if (typeof body === 'string') {
    const obj = JSON.parse(body);
    if (
      typeof obj === 'object' &&
      obj.data &&
      typeof obj.data === 'object' &&
      obj.data.snitch &&
      typeof obj.data.snitch === 'object'
    ) {
      return obj;
    }
  }

  throw new Error(util.format('Invalid payload: %s', body));
};

export const createPlainTextMessage = (snitch: Snitch): string => {
  switch (snitch.status) {
    case 'missing':
      return `${snitch.name} is missing.`;
    case 'healthy':
      return `${snitch.name} is reporting.`;
    case 'paused':
      return `${snitch.name} has been paused.`;
    default:
      return `${snitch.name} reported unknown status: ${snitch.status}`;
  }
};

const createColor = (snitch: Snitch): string => {
  switch (snitch.status) {
    case 'missing':
      return 'danger';
    case 'healthy':
      return 'good';
    case 'paused':
      return 'warning';
    default:
      return '#7639A5'; // purple
  }
};

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const createAttachments = (
  params: WebhookPayload,
): MessageAttachment[] => {
  const snitch = params.data.snitch;
  const message = createPlainTextMessage(snitch);
  return [
    {
      fallback: message,
      title: snitch.name,
      title_link: `https://deadmanssnitch.com/snitches/${snitch.token}`,
      text: message,
      color: createColor(snitch),
      fields: [
        {
          title: 'Status',
          value: capitalize(snitch.status),
          short: true,
        },
        {
          title: 'Reported at',
          value: params.timestamp,
          short: true,
        },
      ],
    },
    {
      fallback: snitch.notes,
      color: '#B0B0B0', // grey
      fields: [
        {
          title: 'Notes',
          value: snitch.notes,
          short: false,
        },
      ],
    },
  ];
};
