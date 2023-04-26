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
  created?: Date;
  createdBy?: number;
  updated?: Date;
  updatedBy?: number;
}
