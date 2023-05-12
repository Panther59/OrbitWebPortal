import { ItemCodeDetail } from '.';

export interface ItemCodeSegment {
		id?: number;
		organizationID?: number;
		name?: string;
		maxLength?: number;
		sequence?: number;
    parentID?: number;
}

export interface ItemCodeSegmentDetail extends ItemCodeSegment{
  codes: Array<ItemCodeDetail>;
}
