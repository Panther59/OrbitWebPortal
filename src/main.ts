import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import themes from 'devextreme/ui/themes';
import { AppModule } from './app/app.module';

themes.initialized(() => {
  platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
});
// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
