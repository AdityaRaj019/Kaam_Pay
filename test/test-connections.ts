import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

async function testConnections() {
  console.log('Testing Redis connection...');
  const { Redis } = await import('ioredis');
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  console.log('Using REDIS_URL:', redisUrl);
  
  const client = new Redis(redisUrl, { maxRetriesPerRequest: 1, connectTimeout: 3000 });
  try {
    const pong = await client.ping();
    console.log('Redis PING success:', pong);
  } catch (err: any) {
    console.error('Redis connection failed:', err.message);
  } finally {
    client.disconnect();
  }

  console.log('\nTesting Kafka connection...');
  const { Kafka, logLevel } = await import('kafkajs');
  if (!process.env.KAFKA_BROKERS) {
    console.error('No KAFKA_BROKERS in env');
    return;
  }
  
  console.log('Brokers:', process.env.KAFKA_BROKERS);
  console.log('CA CERT exists:', !!process.env.KAFKA_CA_CERT, 'Length:', process.env.KAFKA_CA_CERT?.length);
  
  const kafka = new Kafka({
    clientId: 'test-client',
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
    console.log('Kafka admin connected successfully!');
    const topics = await admin.listTopics();
    console.log('Kafka topics in broker:', topics);
    if (!topics.includes('kaampay.chat.messages')) {
      console.log('Creating topics kaampay.chat.messages and kaampay.notifications...');
      try {
        await admin.createTopics({
          topics: [
            { topic: 'kaampay.chat.messages', numPartitions: 1, replicationFactor: 1 },
            { topic: 'kaampay.notifications', numPartitions: 1, replicationFactor: 1 },
          ],
        });
        console.log('Topics created successfully!');
      } catch (err: any) {
        console.error('Failed to create topics:', err.message);
      }
    }
    await admin.disconnect();
  } catch (err: any) {
    console.error('Kafka connection failed:', err.message);
  }
}

testConnections().then(() => console.log('Done test.'));
