import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-prompt',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    FormsModule],
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.css']
})
export class PromptComponent {
  @Input() userInput: string = '';
  @Output() textChange = new EventEmitter<string>();

  constructor() {}

  sendMessage() {
    if (this.userInput.trim() !== '') {
      this.textChange.emit(this.userInput.trim());
      this.userInput = ''; // Clear input after sending message
    }
    //generate event to disable the input
  }
}
