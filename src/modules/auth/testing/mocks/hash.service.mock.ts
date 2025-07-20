export const MockHashService = {
  hashPassword: jest.fn().mockResolvedValue('password-hashed'),
  verifyPassword: jest.fn().mockResolvedValue(true),
};
