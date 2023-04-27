import { Injectable } from '@angular/core';
import { OrganizationService } from './organization.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends OrganizationService {
  public type = 'client';
}
