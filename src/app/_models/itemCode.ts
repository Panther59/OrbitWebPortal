export interface ItemCode {
  id?: number;
  code?: string;
  name?: string;
  segmentID?: number;
}

export interface ItemCodeDetail extends ItemCode {
  children: Array<ItemCode>;
}
