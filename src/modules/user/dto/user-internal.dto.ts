export class UserInternalDto {
  id: string;
  name: string;
  email: string;
  password: string;

  constructor(partial: Partial<UserInternalDto>) {
    Object.assign(this, partial);
  }
}
