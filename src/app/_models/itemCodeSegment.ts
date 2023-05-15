import { ItemCode, ItemCodeDetail, ItemCodeMapping, ItemCodeMappingDetail } from '.';

export interface ItemCodeSegment {
		id?: number;
		organizationID?: number;
		name?: string;
		maxLength?: number;
		sequence?: number;
    parentID?: number;
}

export interface ItemCodeSegmentDetail extends ItemCodeSegment{
  codes: Array<ItemCode>;
  childSegment: ItemCodeSegmentDetail;
  parentSegment: ItemCodeSegmentDetail;
  mappings: Array<ItemCodeMapping>;
}
