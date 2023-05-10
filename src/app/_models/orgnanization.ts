export interface Organization {
  id?: number;
  name?: string;
  code?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  email?: string;
  isActive?: boolean;
  createdOn?: Date;
  createdBy?: number;
  updatedOn?: Date;
  updatedBy?: number;
  type?: OrgType;
}

export enum OrgType {
  Company = 'Company',
  Client = 'Client',
}
