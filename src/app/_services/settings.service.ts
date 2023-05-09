import { Injectable } from '@angular/core';
import { AppSettings, Organization, defaults } from 'app/_models';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '.';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private key = 'orbit-settings';
  private orgKey = 'orbit-org';

  private options: AppSettings;

  private readonly notify$ = new BehaviorSubject<Partial<AppSettings>>({});
  private readonly notifyOrganization$ = new BehaviorSubject<Organization | undefined>(
    this.Organization
  );

  get notify() {
    return this.notify$.asObservable();
  }

  get notifyOrganization() {
    return this.notifyOrganization$.asObservable();
  }

  constructor(private store: LocalStorageService) {
    const storedOptions = this.store.get(this.key);
    this.options = Object.assign(defaults, storedOptions);
  }

  get Options(): AppSettings {
    return this.options;
  }

  set Options(options: AppSettings) {
    this.options = Object.assign(defaults, options);
    this.store.set(this.key, this.options);
    this.notify$.next(this.options);
  }

  get Language() {
    return this.options.language;
  }

  set Language(lang: string) {
    this.options.language = lang;
    this.store.set(this.key, this.options);
    this.notify$.next(this.options);
  }

  get Organization(): Organization | undefined {
    if (this.store.has(this.orgKey)) {
      const org = this.store.get(this.orgKey);
      return org;
    }

    return undefined;
  }

  set Organization(org: Organization | undefined) {
    if (org) {
      const oldOrg = this.Organization;
      if (org.id !== oldOrg?.id || org.name !== oldOrg?.name) {
        this.store.set(this.orgKey, org);
        this.notifyOrganization$.next(org);
      }
    } else {
      this.store.remove(this.orgKey);
    }
  }

  reset() {
    this.store.remove(this.key);
  }
}
