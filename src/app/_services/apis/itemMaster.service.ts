import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ItemCode, ItemCodeMapping, ItemCodeSegment, ItemCodeSegmentDetail } from 'app/_models';

@Injectable({
  providedIn: 'root',
})export class ItemMasterService {


  baseUrl = '';
  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }
  getAll<T>() {
    return this.http.get<Array<T>>(`${this.baseUrl}api/itemMaster/segments`);
  }

  save(segments: Array<ItemCodeSegment>) {
    return this.http.put(`${this.baseUrl}api/itemMaster/segments`, segments);
  }

  delete(segment: ItemCodeSegment) {
    return this.http.delete(`${this.baseUrl}api/itemMaster/segments/${segment.id}`);
  }
}
