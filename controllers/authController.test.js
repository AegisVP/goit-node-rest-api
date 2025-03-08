import { beforeEach, describe, expect, test, vi } from 'vitest';
vi.mock('../services/authServices.js', () => ({ loginUser: vi.fn() }));
import { login } from './authController.js';
import { loginUser } from '../services/authServices.js';
import HttpError from '../helpers/HttpError.js';

describe('authController login', () => {
  const validCreds = { email: 'user@email.com', password: 'examplepassword' };
  const invalidCreds = { email: 'user@email.com', password: 'wrongpassword' };
  const validUser = {
    email: 'user@email.com',
    subscription: 'starter',
    emailVerified: true,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  };
  const unverifiedUser = { emailVerified: false };
  const invalidUser = false;

  beforeEach(() => {
    vi.resetModules();
  });

  test('Login with valid credentials', async () => {
    const mockReq = { body: validCreds };
    const mockRes = { json: vi.fn() };
    const mockNext = vi.fn();
    const mockResult = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      user: { email: 'user@email.com', subscription: 'starter' },
    };

    loginUser.mockResolvedValueOnce(validUser);

    await login(mockReq, mockRes, mockNext);
    expect(loginUser).toBeCalledWith(mockReq.body);
    expect(mockRes.json).toBeCalledWith(mockResult);
  });

  test('Login with inactive user', async () => {
    const mockReq = { body: validCreds };
    const mockRes = { json: vi.fn() };
    const mockNext = vi.fn();

    loginUser.mockResolvedValueOnce(unverifiedUser);

    const mockError = HttpError(401, 'Email not verified');

    await login(mockReq, mockRes, mockNext);
    expect(loginUser).toBeCalledWith(mockReq.body);
    expect(mockNext).toBeCalledWith(mockError);
  });

  test('Login with invalid credentials', async () => {
    const mockReq = { body: invalidCreds };
    const mockRes = { json: vi.fn() };
    const mockNext = vi.fn();
    const mockError = HttpError(401);

    loginUser.mockResolvedValueOnce(invalidUser);

    await login(mockReq, mockRes, mockNext);
    expect(loginUser).toBeCalledWith(mockReq.body);
    expect(mockNext).toBeCalledWith(mockError);
  });

  test('Login with missing credentials', async () => {
    const mockReq = { body: {} };
    const mockRes = { json: vi.fn() };
    const mockNext = vi.fn();
    const mockError = HttpError(401);

    loginUser.mockResolvedValueOnce(invalidUser);

    await login(mockReq, mockRes, mockNext);
    expect(loginUser).toBeCalledWith(mockReq.body);
    expect(mockNext).toBeCalledWith(mockError);
  });
});
