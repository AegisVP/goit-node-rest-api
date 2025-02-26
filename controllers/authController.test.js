import { describe, expect, test, vi } from 'vitest';
import { login } from './authController.js';
import { loginUser } from '../services/authServices.js';
import HttpError from '../helpers/HttpError.js';

const mockRes = { json: vi.fn() };
const mockNext = vi.fn();
const validCreds = { email: 'user@email.com', password: 'examplepassword' };

describe('authController login', () => {
  test('Login with valid credentials', async () => {
    const mockReq = { body: validCreds };
    const mockResult = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      user: { email: 'user@email.com', subscription: 'starter' },
    };

    vi.mock('../services/authServices.js', () => ({
      loginUser: vi.fn().mockResolvedValueOnce({
        id: 1,
        email: 'user@email.com',
        subscription: 'starter',
        avatarURL: 'https://example.com/avatar.jpg',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      }),
    }));

    await login(mockReq, mockRes, mockNext);
    expect(loginUser).toBeCalledWith(mockReq.body);
    expect(mockRes.json).toBeCalledWith(mockResult);
  });
});
