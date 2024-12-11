import { Component } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { ChatbotComponent } from './app/chatbot/chatbot.component';
import { CommonModule } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './app/header/header.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    ChatbotComponent,
    HeaderComponent],
  template: `
    <app-header></app-header>
    <div>
      <app-chatbot></app-chatbot>
    </div>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App, {
  providers: [provideAnimationsAsync()]
});
