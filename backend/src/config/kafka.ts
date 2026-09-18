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

import { Kafka, logLevel } from 'kafkajs';

if (!process.env.KAFKA_BROKERS) throw new Error('Missing env: KAFKA_BROKERS');
if (!process.env.KAFKA_USERNAME) throw new Error('Missing env: KAFKA_USERNAME');
if (!process.env.KAFKA_PASSWORD) throw new Error('Missing env: KAFKA_PASSWORD');
if (!process.env.KAFKA_CA_CERT) throw new Error('Missing env: KAFKA_CA_CERT');

export const kafka = new Kafka({
  clientId: 'kaampay-chat-server',
  brokers: process.env.KAFKA_BROKERS.split(',').map((b) => b.trim()),
  logLevel: logLevel.ERROR, // Keep logs quiet; change to INFO for debugging
  ssl: {
    // Aiven CA cert — proves the broker is legitimate and not an impostor
    ca: [process.env.KAFKA_CA_CERT.replace(/\\n/g, '\n')],
  },
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  // Retry sending up to 5 times before giving up
  retry: { retries: 5 },
});

/** Sends messages TO Kafka. One instance shared across the whole app. */
export const kafkaProducer = kafka.producer();

/** Reads messages FROM Kafka. Uses a consumer group so offsets are tracked. */
export const kafkaConsumer = kafka.consumer({ groupId: 'kaampay-chat-group' });

/** Kafka topic for chat messages */
export const KAFKA_TOPIC_CHAT = 'kaampay.chat.messages';

/** Kafka topic for system notifications (order status changes, etc.) */
export const KAFKA_TOPIC_NOTIFICATIONS = 'kaampay.notifications';
