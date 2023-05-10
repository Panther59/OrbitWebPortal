import { Injectable } from '@angular/core';
import { AppSettings, Organization, UserSettings, defaults } from 'app/_models';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '.';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private key = 'orbit-settings';
  private userKey = 'orbit-user-setting';

  private options: AppSettings;

  private readonly notify$ = new BehaviorSubject<Partial<AppSettings>>({});
  private readonly notifyUserSetting$ = new BehaviorSubject<UserSettings>({});

  get notify() {
    return this.notify$.asObservable();
  }

  get notifyUserSetting() {
    return this.notifyUserSetting$.asObservable();
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

  getUserSetting(userId: number): UserSettings | undefined {
    const finalKey = `${this.userKey}-${userId}`;
    if (this.store.has(finalKey)) {
      const org = this.store.get(finalKey);
      return org;
    }

    return undefined;
  }

  setUserSetting(userId: number, setting: UserSettings | undefined) {
    const finalKey = `${this.userKey}-${userId}`;
    if (setting) {
      this.store.set(finalKey, setting);
      this.notifyUserSetting$.next(setting);
    } else {
      this.store.remove(finalKey);
      this.notifyUserSetting$.next({});
    }
  }

  reset() {
    this.store.remove(this.key);
  }
}
