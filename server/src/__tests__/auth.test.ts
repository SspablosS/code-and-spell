import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

describe('Auth API', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'test' } }
    });
    await prisma.$disconnect();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'SecurePass123!',
    username: 'testuser',
  };

  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      // Очищаем только перед тестами регистрации
      await prisma.user.deleteMany({ where: { email: testUser.email } });
    });

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
      // Сначала создаём пользователя
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      // Потом пробуем снова
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
    beforeAll(async () => {
      // Создаём пользователя один раз для всех login тестов
      await prisma.user.deleteMany({ where: { email: testUser.email } });
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    afterAll(async () => {
      await prisma.user.deleteMany({ where: { email: testUser.email } });
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

    beforeAll(async () => {
      await prisma.user.deleteMany({ where: { email: testUser.email } });
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
      authToken = cookieHeader ? cookieHeader[0].split(';')[0] : '';
    });

    afterAll(async () => {
      await prisma.user.deleteMany({ where: { email: testUser.email } });
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
