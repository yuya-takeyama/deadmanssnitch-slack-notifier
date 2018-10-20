# Dead Man's Snitch Slack Notifier

Notifies reports from [Dead Man's Snitch](https://deadmanssnitch.com/) to arbitrary Slack channels using API Gateway x AWS Lambda.

## Problem

Dead Man's Snitch already can notify to Slack using Slack integration.

But the Slack integration can't be managed with Web API.

## Solution

If a snitch has tags whose names start with `#`, it's interpreted as names of Slack channels. It sends reports to the Slack channels.

## Setup

### Fork

Fork this repository.

Basically, you don't need to modify any files in the repository. But you can do any customization you like.

### Create a Slack App and prepare a OAuth Access Token

1. [Create a Slack App](https://api.slack.com/apps?new_app=1)
1. Go to `Add features and functionality` -> `Permissions`
1. Add the `chat:write:bot` permission
1. Get OAuth Access Token starts with `xoxp-`

### Deploy to AWS

1. Prepare an IAM User which can deploy to AWS using [Serverless Framework](https://serverless.com/) (see: [Credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/))
1. Prepare an IAM Role which has `logs:CreateLogGroup`, `logs:CreateLogStream` and `logs:PutLogEvents` (it's used by the Lambda function)
1. Run `SLACK_TOKEN=[your Slack OAuth Access token] AWS_LAMBDA_IAM_ROLE=[ARN of the IAM Role] yarn deploy` (you also need to environment variables of the IAM User to deploy)

### Deploy using CircleCI (optional)

1. Add the repo to CircleCI
1. Set `SLACK_TOKEN` and `AWS_LAMBDA_IAM_ROLE` to environment variables
1. The default configuration is to deploy when `master` branch is updated

### Integrate with Dead Man's Snitch

1. Add `Webhooks` integration from the admin console of Dead Man's Snitch
1. Set the URL of API Gateway (shown in the result of `yarn deploy`) to the Hook URL
