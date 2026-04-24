import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

describe('Levels API', () => {
  beforeAll(async () => {
    await prisma.$connect();
    const count = await prisma.level.count();
    if (count === 0) {
      throw new Error('Тестовая БД пуста — запусти npx prisma db seed');
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Очистка перед каждым тестом — только тестовых пользователей
    await prisma.user.deleteMany({
      where: { email: { contains: 'test' } }
    });
  });

  const testUser = {
    email: 'levels-test@example.com',
    password: 'SecurePass123!',
    username: 'levelstest',
  };

  let authToken: string;

  beforeEach(async () => {
    // Регистрируем тестового пользователя
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Логинимся для получения токена
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const cookieHeader = loginResponse.headers['set-cookie'];
    authToken = cookieHeader
      ? cookieHeader[0].split(';')[0]
      : '';
  });

  describe('GET /api/levels', () => {
    it('should return 401 without authentication', async () => {
      await request(app).get('/api/levels').expect(401);
    });

    it('should return levels with valid authentication', async () => {
      const response = await request(app)
        .get('/api/levels')
        .set('Cookie', authToken)
        .expect(200);

      expect(response.body.levels).toBeDefined();
      expect(Array.isArray(response.body.levels)).toBe(true);
    });
  });

  describe('GET /api/levels/:id', () => {
    it('should return 401 without authentication', async () => {
      await request(app).get('/api/levels/1').expect(401);
    });

    it('should return level data with valid authentication', async () => {
      const response = await request(app)
        .get('/api/levels/1')
        .set('Cookie', authToken)
        .expect(200);

      expect(response.body.level).toBeDefined();
      expect(response.body.level.id).toBe(1);
    });

    it('should return 404 for non-existent level', async () => {
      const response = await request(app)
        .get('/api/levels/999')
        .set('Cookie', authToken)
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });
});
