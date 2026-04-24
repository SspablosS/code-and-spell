import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

describe('Auth API', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Очистка перед каждым тестом
    await prisma.user.deleteMany();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'SecurePass123!',
    username: 'testuser',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.username).toBe(testUser.username);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 for duplicate email', async () => {
      // Первая регистрация
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // Вторая регистрация с тем же email
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for weak password', async () => {
      const weakPasswordUser = {
        email: 'weak@example.com',
        password: '123',
        username: 'weakuser',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(weakPasswordUser)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Регистрируем пользователя перед тестами логина
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken: string;

    beforeEach(async () => {
      // Регистрируем и логинимся перед тестами
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const cookieHeader = loginResponse.headers['set-cookie'];
      authToken = cookieHeader ? cookieHeader[0] : '';
    });

    it('should return 401 without cookie', async () => {
      await request(app).get('/api/auth/me').expect(401);
    });

    it('should return user data with valid cookie', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', authToken)
        .expect(200);

      expect(response.body.user.email).toBe(testUser.email);
    });
  });
});
