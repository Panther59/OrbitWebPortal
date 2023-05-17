export interface ItemCode {
  id?: number;
  code?: string;
  name?: string;
  listID?: number;
}

export interface ItemCodeList {
  id?: number;
  name?: string;
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
