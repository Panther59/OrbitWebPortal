export interface UserRole {
  organizationID?: number;
  organization?: string;
  roleID?: number;
  role?: string;
  roleType?: RoleTypes;
  userID?: number;
  user?: string;
  email?: string;
  createdOn?: Date;
  createdBy?: number;
  updatedOn?: Date;
  updatedBy?: number;
}

export enum RoleTypes {
  Infra = 'Infra',
  Company = 'Company',
  Client = 'Client',
}
