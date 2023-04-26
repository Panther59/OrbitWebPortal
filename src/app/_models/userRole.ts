export interface UserRole {
  companyID?: number;
  company: string;
  clientID?: number;
  client: string;
  roleID: number;
  role: string;
  userID: number;
  created: Date;
  createdBy: number;
  updated?: Date;
  updatedBy?: number;
}
