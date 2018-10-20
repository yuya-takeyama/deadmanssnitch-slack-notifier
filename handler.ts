import { WebClient } from '@slack/client';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import {
  createAttachments,
  createPlainTextMessage,
  parsePayload,
} from './utils';

const token = process.env.SLACK_TOKEN;
const slack = new WebClient(token);
const iconEmoji = process.env.ICON_EMOJI || ':skull:';

export const webhook: APIGatewayProxyHandler = async (event, context) => {
  try {
    const payload = parsePayload(event.body);
    const snitch = payload.data.snitch;
    console.log('payload: %j', payload);

    const slackChannels = snitch.tags.filter(tag => tag.startsWith('#'));
    const promises = slackChannels.map(channel => {
      return slack.chat.postMessage({
        channel,
        icon_emoji: iconEmoji,
        username: "Dead Man's Snitch Slack Notifier",
        text: createPlainTextMessage(snitch),
        attachments: createAttachments(payload),
      });
    });

    await Promise.all(promises);

    return {
      statusCode: 200,
      body: JSON.stringify({
        input: event,
      }),
    };
  } catch (e) {
    const message =
      typeof e === 'object' && e.message ? e.message : 'Unknown error';
    console.error(e);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message,
        input: event,
        error: e,
      }),
    };
  }
};
