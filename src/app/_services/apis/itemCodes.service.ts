import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ItemCode, ItemCodeMapping, ItemCodeSegment, ItemCodeSegmentDetail } from 'app/_models';

@Injectable({
  providedIn: 'root',
})export class ItemCodesService {


  baseUrl = '';
  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiUrl;
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

}
