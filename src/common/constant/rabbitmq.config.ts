export const rabbitmqConfig = {
  exchanges: [
    {
      name: 'order_created',
      type: 'fanout', // Fanout exchange to broadcast the message
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
