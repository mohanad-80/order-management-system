import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { setupApp } from '../src/setup-app';

describe('e2e for the required endpoints', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userId: number;
  let productId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clear the database before running the tests
    await prisma.$executeRaw`TRUNCATE TABLE "Cart", "OrderItem", "Order", "Product", "User", "Coupon" RESTART IDENTITY CASCADE`;

    // Seed the database with necessary data
    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'A product for testing',
        price: 100,
        stock: 50,
      },
    });

    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        address: '123 Testing Lane',
      },
    });

    await prisma.coupon.create({
      data: {
        code: 'TESTCOUPON',
        discount: 10,
      },
    });

    productId = product.id;
    userId = user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/cart/add (POST) should add a product to the cart', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/cart/add')
      .send({
        userId: userId,
        productId: productId,
        quantity: 2,
      })
      .expect(201);

    expect(response.body).toHaveProperty('userId', userId);
    expect(response.body).toHaveProperty('productId', productId);
    expect(response.body).toHaveProperty('quantity', 2);
  });

  it("/api/cart/:userId (GET) should retrieve the user's cart", async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/cart/${userId}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('userId', userId);
    expect(response.body[0]).toHaveProperty('productId', productId);
  });

  it('/api/orders (POST) should create a new order', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/orders')
      .send({
        userId: userId,
      })
      .expect(201);

    expect(response.body).toHaveProperty('userId', userId);
    expect(response.body).toHaveProperty('status', 'PENDING');
    // expect(response.body.OrderItem).toHaveLength(1);
  });

  it('/api/orders/:orderId (GET) should retrieve the order by ID', async () => {
    const order = await prisma.order.findFirst();
    const response = await request(app.getHttpServer())
      .get(`/api/orders/${order.id}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', order.id);
    expect(response.body).toHaveProperty('userId', userId);
  });

  it('/api/orders/apply-coupon (POST) should apply a coupon to the order', async () => {
    const order = await prisma.order.findFirst();
    const response = await request(app.getHttpServer())
      .post('/api/orders/apply-coupon')
      .send({
        orderId: order.id,
        code: 'TESTCOUPON',
      })
      .expect(201);

    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('discountApplied', true);
  });
});
