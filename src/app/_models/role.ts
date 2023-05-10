import { RoleTypes } from './userRole';

export interface Role {
    id?: number;
    name?: string;
    type?: RoleTypes;
    createdOn?: Date;
    createdBy?: number;
    updatedOn?: Date;
    updatedBy?: number;
  }
