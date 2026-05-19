import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

const testUser = {
  email: 'auth-ci@example.com',
  password: 'SecurePass123!',
  username: 'authciuser',
};

async function cleanupTestUser() {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
}

describe('Auth API', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await cleanupTestUser();
  });

  afterAll(async () => {
    await cleanupTestUser();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    beforeEach(cleanupTestUser);

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
      await request(app).post('/api/auth/register').send(testUser).expect(201);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'weak-auth@example.com',
          password: '123',
          username: 'weakuser',
        })
        .expect(400);

      expect(response.body.error).toBeDefined();

      await prisma.user.deleteMany({ where: { email: 'weak-auth@example.com' } });
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      await cleanupTestUser();
      await request(app).post('/api/auth/register').send(testUser).expect(201);
    });

    afterAll(cleanupTestUser);

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
    let agent: ReturnType<typeof request.agent>;

    beforeAll(async () => {
      await cleanupTestUser();
      agent = request.agent(app);
      await agent.post('/api/auth/register').send(testUser).expect(201);
      await agent
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);
    });

    afterAll(cleanupTestUser);

    it('should return 401 without cookie', async () => {
      await request(app).get('/api/auth/me').expect(401);
    });

    it('should return user data with valid cookie', async () => {
      const response = await agent.get('/api/auth/me').expect(200);

      expect(response.body.user.email).toBe(testUser.email);
    });
  });
});
