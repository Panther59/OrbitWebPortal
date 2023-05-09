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
    this.getOrganization()
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

  getOptions(): AppSettings {
    return this.options;
  }

  setOptions(options: AppSettings) {
    this.options = Object.assign(defaults, options);
    this.store.set(this.key, this.options);
    this.notify$.next(this.options);
  }

  getLanguage() {
    return this.options.language;
  }

  setLanguage(lang: string) {
    this.options.language = lang;
    this.store.set(this.key, this.options);
    this.notify$.next(this.options);
  }

  getOrganization(): Organization | undefined {
    if (this.store.has(this.orgKey)) {
      const org = this.store.get(this.orgKey);
      return org;
    }

    return undefined;
  }

  setOrganization(org?: Organization) {
    if (org) {
      const oldOrg = this.getOrganization();
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
