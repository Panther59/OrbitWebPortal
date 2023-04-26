import { User } from './interface';

export const admin: User = {
  id: 1,
  name: 'uchauhan',
  email: 'uchauhan@163.com',
  picture: './assets/images/avatar.jpg',
};

export const guest: User = {
  name: 'unknown',
  email: 'unknown',
  picture: './assets/images/avatar-default.jpg',
};
