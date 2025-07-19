export const MockHashService = {
  hashPassword: jest
    .fn()
    .mockImplementation(async (password: string) =>
      Promise.resolve(`hashed-${password}`),
    ),
};
