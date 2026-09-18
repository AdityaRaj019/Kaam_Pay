import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

async function runOfflineNotificationTest() {
  console.log('🧪 Starting Offline Notification Verification Test...');

  const { Kafka, logLevel } = await import('kafkajs');
  const { default: prisma } = await import('../backend/src/config/prisma');
  const { KAFKA_TOPIC_OFFLINE_NOTIFICATIONS } = await import('../backend/src/config/kafka');

  if (!process.env.KAFKA_BROKERS) {
    throw new Error('Missing KAFKA_BROKERS in .env');
  }

  // 1. Fetch or create a test recipient and sender from the database
  const users = await prisma.user.findMany({ take: 2 });
  if (users.length < 2) {
    throw new Error('At least 2 users required in the database to test counterparty notifications.');
  }

  const [sender, recipient] = users;
  console.log(`👤 Sender: ${sender.name} (${sender.id})`);
  console.log(`👤 Recipient (Offline Counterparty): ${recipient.name} (${recipient.id})`);

  // 2. Set up Kafka client
  const kafka = new Kafka({
    clientId: 'offline-notification-test',
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

  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: `test-offline-verifier-${Date.now()}` });

  try {
    await producer.connect();
    console.log('✅ Producer connected');

    await consumer.connect();
    console.log('✅ Consumer connected');

    await consumer.subscribe({
      topic: KAFKA_TOPIC_OFFLINE_NOTIFICATIONS,
      fromBeginning: true,
    });

    const testPayload = {
      userId: recipient.id,
      senderId: sender.id,
      senderName: sender.name,
      orderId: 'test-order-sample',
      type: 'NEW_MESSAGE',
      message: `${sender.name}: Hey, this is an offline notification test via Aiven Kafka!`,
      createdAt: new Date().toISOString(),
    };

    let messageReceived = false;
    let createdNotificationId: string | null = null;

    const messagePromise = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (!messageReceived) {
          reject(new Error('Timeout: Did not receive message from Kafka within 15 seconds.'));
        }
      }, 15000);

      consumer.run({
        eachMessage: async ({ topic, message }) => {
          if (!message.value) return;
          try {
            const data = JSON.parse(message.value.toString());
            console.log(`📩 Received message on topic [${topic}]:`, data);

            if (data.userId === recipient.id && data.senderId === sender.id) {
              messageReceived = true;
              clearTimeout(timer);

              // Emulate handleOfflineNotification
              const notification = await prisma.notification.create({
                data: {
                  userId: data.userId,
                  type: data.type,
                  message: data.message,
                },
              });
              createdNotificationId = notification.id;
              console.log(`💾 Saved notification in DB with ID: ${notification.id}`);
              resolve();
            }
          } catch (err) {
            clearTimeout(timer);
            reject(err);
          }
        },
      });
    });

    // Give consumer group 2 seconds to complete partition assignment
    await new Promise((r) => setTimeout(r, 2000));

    console.log(`🚀 Publishing offline notification to Kafka topic: ${KAFKA_TOPIC_OFFLINE_NOTIFICATIONS}...`);
    await producer.send({
      topic: KAFKA_TOPIC_OFFLINE_NOTIFICATIONS,
      messages: [
        {
          key: recipient.id,
          value: JSON.stringify(testPayload),
        },
      ],
    });

    await messagePromise;

    // Verify persisted record in Prisma
    const verifiedNotification = await prisma.notification.findUnique({
      where: { id: createdNotificationId! },
    });

    if (!verifiedNotification) {
      throw new Error('Notification record not found in database!');
    }

    console.log('✅ Verified notification in database:', verifiedNotification);

    // Clean up test notification
    await prisma.notification.delete({
      where: { id: createdNotificationId! },
    });
    console.log('🧹 Cleaned up test notification record from DB.');

    console.log('🎉 Offline notification Kafka pipeline test PASSED successfully!');
  } finally {
    await producer.disconnect().catch(() => {});
    await consumer.disconnect().catch(() => {});
    await prisma.$disconnect().catch(() => {});
  }
}

runOfflineNotificationTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
