/**
 * kafka.ts — Aiven Kafka client configuration
 *
 * Aiven enforces SSL + SASL/PLAIN authentication.
 * The CA certificate proves the Aiven broker's identity.
 *
 * How to get your credentials:
 *  1. Go to Aiven Console → Your Kafka service
 *  2. "Connection Information" tab → copy Broker URL, username, password
 *  3. Download the CA Certificate file and paste its content into KAFKA_CA_CERT (.env)
 */

import { Kafka, logLevel, type Producer, type Consumer } from 'kafkajs';

export const isKafkaConfigured = Boolean(
  process.env.KAFKA_BROKERS && process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD,
);

let kafkaInstance: Kafka | null = null;
let producerInstance: Producer;
let consumerInstance: Consumer;

if (isKafkaConfigured) {
  kafkaInstance = new Kafka({
    clientId: 'kaampay-chat-server',
    brokers: (process.env.KAFKA_BROKERS || '').split(',').map((b) => b.trim()),
    logLevel: logLevel.ERROR, // Keep logs quiet; change to INFO for debugging
    ...(process.env.KAFKA_CA_CERT
      ? {
          ssl: {
            // Aiven CA cert — proves the broker is legitimate and not an impostor
            ca: [process.env.KAFKA_CA_CERT.replace(/\\n/g, '\n')],
          },
        }
      : {}),
    sasl: {
      mechanism: 'plain',
      username: process.env.KAFKA_USERNAME || '',
      password: process.env.KAFKA_PASSWORD || '',
    },
    // Retry sending up to 5 times before giving up
    retry: { retries: 5 },
  });

  producerInstance = kafkaInstance.producer();
  consumerInstance = kafkaInstance.consumer({ groupId: 'kaampay-chat-group' });
} else {
  // Safe mock producer & consumer for dev fallback when Kafka is not configured
  producerInstance = {
    connect: async () => {},
    disconnect: async () => {},
    send: async () => [] as never[],
  } as unknown as Producer;

  consumerInstance = {
    connect: async () => {},
    disconnect: async () => {},
    subscribe: async () => {},
    run: async () => {},
  } as unknown as Consumer;
}

export const kafka = kafkaInstance;

/** Sends messages TO Kafka. One instance shared across the whole app. */
export const kafkaProducer = producerInstance;

/** Reads messages FROM Kafka. Uses a consumer group so offsets are tracked. */
export const kafkaConsumer = consumerInstance;

/** Kafka topic for chat messages */
export const KAFKA_TOPIC_CHAT = 'kaampay.chat.messages';

/** Kafka topic for system notifications (order status changes, etc.) */
export const KAFKA_TOPIC_NOTIFICATIONS = 'kaampay.notifications';

/** Kafka topic for offline counterparty notifications */
export const KAFKA_TOPIC_OFFLINE_NOTIFICATIONS = 'kaampay.notifications.offline';

/**
 * Ensures that all required Kafka topics exist on the broker.
 * Automatically runs during backend bootstrap before consumers start.
 */
export async function ensureKafkaTopics(): Promise<void> {
  if (!isKafkaConfigured || !kafkaInstance) {
    console.log('[Kafka Admin] Kafka is not configured. Running in in-memory dev mode ⚠️');
    return;
  }
  const admin = kafkaInstance.admin();
  try {
    await admin.connect();
    const existingTopics = await admin.listTopics();
    const requiredTopics = [
      KAFKA_TOPIC_CHAT,
      KAFKA_TOPIC_NOTIFICATIONS,
      KAFKA_TOPIC_OFFLINE_NOTIFICATIONS,
    ];

    const missingTopics = requiredTopics.filter((topic) => !existingTopics.includes(topic));
    if (missingTopics.length > 0) {
      console.log(`[Kafka Admin] Creating missing topics: ${missingTopics.join(', ')}...`);
      await admin.createTopics({
        topics: missingTopics.map((topic) => ({
          topic,
          numPartitions: 1,
          replicationFactor: 1,
        })),
      });
      console.log('[Kafka Admin] Required topics created successfully ✅');
    } else {
      console.log('[Kafka Admin] Required topics verified on broker ✅');
    }
  } catch (error) {
    console.error('[Kafka Admin] Warning: Failed to verify/create Kafka topics:', error);
  } finally {
    await admin.disconnect().catch(() => {});
  }
}
