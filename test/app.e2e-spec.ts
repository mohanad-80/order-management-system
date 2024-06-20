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
  let orderId: number;

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

  it('/api/cart/add (POST) should throw when adding in cart a quantity bigger than stock', async () => {
    await request(app.getHttpServer())
      .post('/api/cart/add')
      .send({
        userId: userId,
        productId: productId,
        quantity: 51,
      })
      .expect(400);
  });

  it('/api/cart/add (POST) should throw when adding in cart a product with invalid ID', async () => {
    await request(app.getHttpServer())
      .post('/api/cart/add')
      .send({
        userId: userId,
        productId: 5,
        quantity: 5,
      })
      .expect(400);
  });

  it("/api/cart/:userId (GET) should retrieve the user's cart", async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/cart/${userId}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('userId', userId);
    expect(response.body[0]).toHaveProperty('productId', productId);
  });

  it('/api/cart/:userId (GET) should return empty array if given invalid ID', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/cart/3')
      .expect(200);

    expect(response.body).toHaveLength(0);
  });

  it('/api/cart/update (PUT) should update quantity of a product in the cart', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/cart/update')
      .send({
        userId: userId,
        productId: productId,
        quantity: 5,
      })
      .expect(200);

    expect(response.body).toHaveProperty('userId', userId);
    expect(response.body).toHaveProperty('productId', productId);
    expect(response.body).toHaveProperty('quantity', 5);
  });

  it('/api/cart/update (PUT) should throw when adding in cart a quantity bigger than stock', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/cart/update')
      .send({
        userId: userId,
        productId: productId,
        quantity: 51,
      })
      .expect(400);
  });

  it('/api/cart/update (PUT) should throw when adding in cart a product with invalid ID', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/cart/update')
      .send({
        userId: userId,
        productId: 5,
        quantity: 5,
      })
      .expect(400);
  });

  it('/api/cart/remove (DELETE) should remove a product from the cart', async () => {
    const response = await request(app.getHttpServer())
      .delete('/api/cart/remove')
      .send({
        userId: userId,
        productId: productId,
      })
      .expect(200);

    expect(response.body).toHaveProperty('count', 1);
  });

  it('/api/cart/remove (DELETE) should throw when provided with invalid request body data', async () => {
    const response = await request(app.getHttpServer())
      .delete('/api/cart/remove')
      .send({
        userId: '2',
        productId: '2',
      })
      .expect(400);
  });

  it('/api/orders (POST) should create a new order', async () => {
    await request(app.getHttpServer())
      .post('/api/cart/add')
      .send({
        userId: userId,
        productId: productId,
        quantity: 3,
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/api/orders')
      .send({
        userId: userId,
      })
      .expect(201);

    orderId = response.body.id;
    expect(response.body).toHaveProperty('userId', userId);
    expect(response.body).toHaveProperty('status', 'PENDING');
    expect(response.body).toHaveProperty('discountApplied', false);
  });

  it('/api/orders (POST) should throw when the cart is empty', async () => {
    await request(app.getHttpServer())
      .post('/api/orders')
      .send({
        userId: userId,
      })
      .expect(400);
  });

  it('/api/orders/:orderId (GET) should retrieve the order by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/orders/${orderId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', orderId);
    expect(response.body).toHaveProperty('userId', userId);
    expect(response.body.OrderItem).toHaveLength(1);
  });

  it('/api/orders/:orderId (GET) should return empty object when the ID is not found', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/orders/4`)
      .expect(200);

    expect(response.body).toEqual({});
  });

  it('/api/orders/:orderId/status (PUT) should update the status of an order', async () => {
    const newStatus = 'shipped';
    const response = await request(app.getHttpServer())
      .put(`/api/orders/${orderId}/status`)
      .send({
        status: newStatus,
      })
      .expect(200);

    expect(response.body).toHaveProperty('id', orderId);
    expect(response.body).toHaveProperty('userId', userId);
    expect(response.body).toHaveProperty('status', newStatus);
  });

  it('/api/orders/:orderId/status (PUT) should throw if the request body data is invalid', async () => {
    const response = await request(app.getHttpServer())
      .put(`/api/orders/${orderId}/status`)
      .send({
        status: 123,
      })
      .expect(400);
  });

  it('/api/users/:userId/orders (GET) should retrieve user orders history', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/users/${userId}/orders`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('id', orderId);
    expect(response.body[0]).toHaveProperty('userId', userId);
  });

  it('/api/users/:userId/orders (GET) should return empty array if the ID is invalid', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/users/3/orders`)
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('/api/orders/apply-coupon (POST) should apply a coupon to the order', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/orders/apply-coupon')
      .send({
        orderId: orderId,
        code: 'TESTCOUPON',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id', orderId);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('discountApplied', true);
  });

  it('/api/orders/apply-coupon (POST) should throw if there is already a discount applied to the order', async () => {
    await request(app.getHttpServer())
      .post('/api/orders/apply-coupon')
      .send({
        orderId: orderId,
        code: 'TESTCOUPON',
      })
      .expect(400);
  });

  it('/api/orders/apply-coupon (POST) should throw if the coupon not found', async () => {
    await request(app.getHttpServer())
      .post('/api/orders/apply-coupon')
      .send({
        orderId: orderId,
        code: 'OTHERCOUPON',
      })
      .expect(404);
  });

  it('/api/orders/apply-coupon (POST) should throw if the order not found', async () => {
    await request(app.getHttpServer())
      .post('/api/orders/apply-coupon')
      .send({
        orderId: 5,
        code: 'TESTCOUPON',
      })
      .expect(404);
  });
});
