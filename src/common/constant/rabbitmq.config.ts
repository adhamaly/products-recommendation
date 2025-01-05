import { RabbitExchanges } from '../enums/rabbitmq-exchanges.enum';

export const rabbitmqConfig = {
  exchanges: [
    {
      name: RabbitExchanges.MESSAGE_WORKER,
      type: 'direct',
      options: {
        durable: true,
      },
    },
  ],
  channels: {
    'main-channel': {
      default: true,
      prefetchCount: 10,
    },
  },
  connectionInitOptions: { wait: false },
  enableDirectReplyTo: true,
};
