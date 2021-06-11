import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Config } from './config';
import { MainComponent } from './main/main.component';
import { HttpTranscriptionService, TranscriptionService } from './service/transcription.service';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule, MatCardModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule
  ],
  providers: [
    Config, 
    { provide: TranscriptionService, useClass: HttpTranscriptionService },
  ],
  bootstrap: [],
  entryComponents: [MainComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(MainComponent, { injector });
    customElements.define('mt-app', el);
  }
  ngDoBootstrap() { }
}
