import { UserResponseDto } from '../../dto/user-response.dto';

export const UserResponseFixture = new UserResponseDto({
  id: '4cbde839-2ee6-4cc2-bf75-e056b938d74e',
  name: 'User',
  email: 'user@email.com',
  createdAt: new Date(),
  updatedAt: new Date(),
});
