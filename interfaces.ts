export interface WebhookPayload {
  type: 'snitch.reporting' | 'snitch.missing' | 'snitch.paused';
  timestamp: string;
  data: {
    snitch: Snitch;
  };
}

export interface Snitch {
  token: string;
  name: string;
  notes: string;
  tags: string[];
  status: 'pending' | 'healthy' | 'missing' | 'paused';
  previous_status: 'healthy' | 'missing' | 'paused';
}
