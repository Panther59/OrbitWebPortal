import { ItemCode, ItemCodeDetail, ItemCodeMapping, ItemCodeMappingDetail } from '.';

export interface ItemCodeSegment {
		id?: number;
		organizationID?: number;
		name?: string;
		maxLength?: number;
		sequence?: number;
    parentID?: number;
    isLinkedCodeList?: boolean;
    itemCodeListID?: number;
}

export interface SelectorItemCodeSegment extends ItemCodeSegment {
  selectedCode?: number;
  codes: Array<ItemCode>;
  positionCodes: any;
  selectedPositionCodes: any;
}

export interface ItemCodeSegmentDetail extends ItemCodeSegment{
  codes: Array<ItemCode>;
  childSegment: ItemCodeSegmentDetail;
  parentSegment: ItemCodeSegmentDetail;
  mappings: Array<ItemCodeMapping>;
}
