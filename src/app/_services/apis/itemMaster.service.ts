import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ItemCodeMapping, ItemCodeSegment, ItemCodeSegmentDetail } from 'app/_models';

@Injectable({
  providedIn: 'root',
})export class ItemMasterService {


  baseUrl = '';
  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }
  getAll() {
    return this.http.get<Array<ItemCodeSegment>>(`${this.baseUrl}api/itemMaster/segments`);
  }

  save(segments: Array<ItemCodeSegment>) {
    return this.http.put(`${this.baseUrl}api/itemMaster/segments`, segments);
  }

  delete(segment: ItemCodeSegment) {
    return this.http.delete(`${this.baseUrl}api/itemMaster/segments/${segment.id}`);
  }

  upload(id:number, formData: FormData) {
    return this.http.post<Array<string>>(`${this.baseUrl}api/itemMaster/mappings/${id}`, formData);
  }

  getSegmentDetail(id: number) {
    return this.http.get<ItemCodeSegmentDetail>(`${this.baseUrl}api/itemMaster/codes/${id}`);
  }

  deleteCodeMappings(mappings: Array<ItemCodeMapping>){
    return this.http.post<ItemCodeSegmentDetail>(`${this.baseUrl}api/itemMaster/mappings/bulkDelete`, mappings);

  }
}
