import 'dotenv/config';
import { randomUUID } from 'crypto';
import prisma from '../backend/src/config/prisma';
import { OrderService } from '../backend/src/modules/order/order.service';

async function runIntegrationTest() {
  console.log('🧪 Starting End-to-End OrderService Idempotency Integration Test...');

  // 1. Fetch existing Client and Freelancer
  const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
  const freelancer = await prisma.user.findFirst({ where: { role: 'FREELANCER' } });

  if (!client || !freelancer) {
    throw new Error('Missing client or freelancer in test database.');
  }

  // 2. Fetch or create an active gig
  let gig = await prisma.gig.findFirst({
    where: { freelancerId: freelancer.id, status: 'ACTIVE' },
  });

  if (!gig) {
    gig = await prisma.gig.create({
      data: {
        freelancerId: freelancer.id,
        title: 'Idempotency E2E Gig',
        description: 'E2E test gig',
        category: 'Development',
        price: 500,
        deliveryTime: 2,
        status: 'ACTIVE',
      },
    });
  }

  const idempotencyKey = `e2e-order-key-${randomUUID()}`;
  console.log(`🔑 Testing with idempotency key: ${idempotencyKey}`);

  // Test 1: First initiateOrder call -> should create a new order
  console.log('\n--- Test 1: Initiate initial order ---');
  const res1 = await OrderService.initiateOrder(client.id, {
    gigId: gig.id,
    quantity: 1,
    idempotencyKey,
  });

  console.log('Result 1 isExisting:', res1.isExisting);
  console.log('Result 1 Order ID:', res1.order.id);
  console.log('Result 1 Status:', res1.order.status);
  console.log('Result 1 Idempotency Key:', res1.order.idempotencyKey);

  if (res1.isExisting !== false) {
    throw new Error('Expected isExisting to be false on initial creation.');
  }
  if (res1.order.idempotencyKey !== idempotencyKey) {
    throw new Error('Order does not contain the specified idempotencyKey.');
  }

  // Test 2: Second initiateOrder call with the EXACT SAME idempotency key (network retry)
  console.log('\n--- Test 2: Network retry with same idempotency key ---');
  const res2 = await OrderService.initiateOrder(client.id, {
    gigId: gig.id,
    quantity: 1,
    idempotencyKey,
  });

  console.log('Result 2 isExisting:', res2.isExisting);
  console.log('Result 2 Order ID:', res2.order.id);

  if (res2.isExisting !== true) {
    throw new Error('Expected isExisting to be true on retry.');
  }
  if (res2.order.id !== res1.order.id) {
    throw new Error(`Order ID changed on retry! Expected ${res1.order.id}, got ${res2.order.id}`);
  }

  // Test 3: Lookup by Idempotency Key
  console.log('\n--- Test 3: Fetch order by idempotency key ---');
  const keyLookup = await OrderService.getOrderByIdempotencyKey(idempotencyKey, client.id);
  if (keyLookup.order.id !== res1.order.id) {
    throw new Error(`Lookup by key failed: expected ${res1.order.id}, got ${keyLookup.order.id}`);
  }
  console.log('✅ getOrderByIdempotencyKey successfully found order:', keyLookup.order.id);

  // Test 4: Idempotency conflict with different parameters
  console.log(
    '\n--- Test 4: Verify conflict error if same key is reused with different quantity ---',
  );
  let conflictCaught = false;
  try {
    await OrderService.initiateOrder(client.id, {
      gigId: gig.id,
      quantity: 5, // DIFFERENT QUANTITY
      idempotencyKey,
    });
  } catch (err: any) {
    if (err?.statusCode === 409) {
      conflictCaught = true;
      console.log('✅ Correctly received 409 conflict for mismatched payload parameters.');
    } else {
      throw err;
    }
  }

  if (!conflictCaught) {
    throw new Error('Expected 409 conflict when payload differed for the same idempotency key.');
  }

  // Test 5: Idempotency with another user
  console.log('\n--- Test 5: Verify conflict if different user uses the same idempotency key ---');
  let userConflictCaught = false;
  try {
    await OrderService.initiateOrder('another-client-id-xyz', {
      gigId: gig.id,
      quantity: 1,
      idempotencyKey,
    });
  } catch (err: any) {
    if (err?.statusCode === 409) {
      userConflictCaught = true;
      console.log('✅ Correctly received 409 conflict for cross-user idempotency key collision.');
    } else {
      throw err;
    }
  }

  if (!userConflictCaught) {
    throw new Error('Expected 409 conflict for cross-user idempotency key collision.');
  }

  // Test 6: Idempotent status transitions
  console.log('\n--- Test 6: Test idempotent status transitions ---');
  const paidTransition1 = await OrderService.transitionStatus(
    res1.order.id,
    client.id,
    'PAYMENT_PENDING',
  );
  console.log(
    'Transition 1 target:',
    paidTransition1.transition.to,
    'alreadyInState:',
    paidTransition1.transition.alreadyInState,
  );

  // Repeat transition (simulating slow network retry of mark payment pending)
  const paidTransition2 = await OrderService.transitionStatus(
    res1.order.id,
    client.id,
    'PAYMENT_PENDING',
  );
  console.log(
    'Transition 2 target:',
    paidTransition2.transition.to,
    'alreadyInState:',
    paidTransition2.transition.alreadyInState,
  );

  if (paidTransition2.transition.alreadyInState !== true) {
    throw new Error('Expected alreadyInState to be true on repeating the same transition.');
  }

  // Clean up test order
  console.log('\n--- Cleanup ---');
  await prisma.order.delete({ where: { id: res1.order.id } });
  console.log('✅ Cleaned up test order.');

  console.log('\n🎉 ALL ORDER IDEMPOTENCY INTEGRATION TESTS PASSED SUCCESSFULLY! 🚀');
}

runIntegrationTest()
  .catch((err) => {
    console.error('❌ Integration test failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
