export class User {
  [prop: string]: any;

  id?: number | string | null;
  name?: string;
  initial?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  picture?: string;
  roles?: any[];
  permissions?: any[];
}
