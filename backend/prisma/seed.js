const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('password', 10),
    },
  });

  console.log('Admin user created:', adminUser);

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
      password: await bcrypt.hash('password', 10),
    },
  });

  console.log('Demo user created:', demoUser);

  // Create demo session
  const demoSession = await prisma.session.upsert({
    where: {
      userId_sessionName: {
        userId: demoUser.id,
        sessionName: 'Demo Session',
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      sessionName: 'Demo Session',
      webhookUrl: 'https://webhook.site/demo',
      status: 'disconnected',
    },
  });

  console.log('Demo session created:', demoSession);

  // Create demo webhook
  const demoWebhook = await prisma.webhook.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      sessionId: demoSession.id,
      url: 'https://webhook.site/demo-webhook',
      secret: 'demo-secret',
      events: ['message', 'status'],
      active: true,
    },
  });

  console.log('Demo webhook created:', demoWebhook);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

