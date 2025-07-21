import { Expose } from 'class-transformer';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;

  @Expose({ groups: ['internal'] })
  password: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
