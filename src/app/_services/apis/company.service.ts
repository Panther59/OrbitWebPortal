import { Injectable } from '@angular/core';
import { OrganizationService } from './organization.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyService extends OrganizationService {
  public type = 'company';
}
