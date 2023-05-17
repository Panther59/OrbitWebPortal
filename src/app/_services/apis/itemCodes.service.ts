import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  ItemCode,
  ItemCodeList,
  ItemCodeMapping,
  ItemCodeSegment,
  ItemCodeSegmentDetail,
} from 'app/_models';

@Injectable({
  providedIn: 'root',
})
export class ItemCodesService {
  baseUrl = '';
  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  getAllCodeLists() {
    return this.http.get<Array<ItemCodeList>>(`${this.baseUrl}api/itemcodes/lists`);
  }

  getCodes(listId: number, parentId?: number) {
    let url = `${this.baseUrl}api/itemcodes/lists/${listId}`;
    if (parentId) {
      url = `${url}?parentId=${parentId}`;
    }
    return this.http.get<Array<ItemCode>>(url);
  }

  saveCodeList(list: ItemCodeList) {
    return this.http.put<ItemCodeList>(`${this.baseUrl}api/itemcodes/lists`, list);
  }

  getSegmentDetail(id: any) {
    return this.http.get<ItemCodeSegmentDetail>(`${this.baseUrl}api/itemcodes/${id}`);
  }

  saveItemCode(item: ItemCode) {
    return this.http.put<ItemCode>(`${this.baseUrl}api/itemcodes`, item);
  }

  deleteItemCode(items: Array<ItemCode>) {
    return this.http.post<ItemCode>(`${this.baseUrl}api/itemcodes/bulkDelete`, items);
  }

  upload(id: number, formData: FormData) {
    return this.http.post<Array<string>>(`${this.baseUrl}api/itemcodes/mappings/${id}`, formData);
  }

  deleteCodeMappings(mappings: Array<ItemCodeMapping>) {
    return this.http.post<ItemCodeSegmentDetail>(
      `${this.baseUrl}api/itemcodes/mappings/bulkDelete`,
      mappings
    );
  }
}
