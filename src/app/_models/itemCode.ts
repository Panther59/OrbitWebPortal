export interface ItemCode {
  id?: number;
  code?: string;
  name?: string;
  segmentID?: number;
}

export interface ItemCodeDetail extends ItemCode {
  children: Array<ItemCode>;
}

export interface ItemCodeMappingDetail extends ItemCode  {
  displayCode?: string;
  childId?: number;
  childCode?: string;
  childName?: string;
}


export interface ItemCodeMapping   {
  childId?: number;
  parentId?: number;
}
