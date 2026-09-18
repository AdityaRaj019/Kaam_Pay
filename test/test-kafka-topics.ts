import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

async function verifyAndCreateTopics() {
  const { Kafka, logLevel } = await import('kafkajs');
  if (!process.env.KAFKA_BROKERS) {
    throw new Error('Missing KAFKA_BROKERS');
  }

  const kafka = new Kafka({
    clientId: 'topic-provisioner-test',
    brokers: process.env.KAFKA_BROKERS.split(','),
    logLevel: logLevel.ERROR,
    ssl: {
      ca: [process.env.KAFKA_CA_CERT ? process.env.KAFKA_CA_CERT.replace(/\\n/g, '\n') : ''],
    },
    sasl: {
      mechanism: 'plain',
      username: process.env.KAFKA_USERNAME || '',
      password: process.env.KAFKA_PASSWORD || '',
    },
    connectionTimeout: 8000,
  });

  const admin = kafka.admin();
  try {
    await admin.connect();
    console.log('✅ Connected to Kafka admin');

    const existingTopics = await admin.listTopics();
    console.log('Current topics:', existingTopics);

    const requiredTopics = [
      'kaampay.chat.messages',
      'kaampay.notifications',
      'kaampay.notifications.offline',
    ];

    const toCreate = requiredTopics.filter((t) => !existingTopics.includes(t));
    if (toCreate.length > 0) {
      console.log('Topics to create:', toCreate);
      const created = await admin.createTopics({
        topics: toCreate.map((t) => ({
          topic: t,
          numPartitions: 1,
          replicationFactor: 1,
        })),
      });
      console.log('Topic creation result:', created);
    } else {
      console.log('All required topics already exist.');
    }

    const updatedTopics = await admin.listTopics();
    console.log('Updated topics in broker:', updatedTopics);
  } finally {
    await admin.disconnect();
  }
}

verifyAndCreateTopics()
  .then(() => console.log('Done.'))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
