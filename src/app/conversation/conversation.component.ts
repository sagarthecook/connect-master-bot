import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IConversationMessage } from '../interfaces/conversation-message';
import { IMessageMenu } from '../interfaces/imessage-menu';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conversation',
  standalone: true,
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ConversationComponent implements AfterViewChecked {
  @ViewChild('conversationContainer', { static: true }) conversationContainer!: ElementRef<HTMLDivElement>;
  @Input() messages: IConversationMessage[] = [];
  @Input() menuId!: string;
  @Input() questionId!: string;
  @Output() menuSelected = new EventEmitter<IMessageMenu>();
  @Output() answerSelected = new EventEmitter<string>();
  userInput: string = '';
  answerDDId!: string;

  ngAfterViewChecked(): void {
    const calculatedTop = this.conversationContainer.nativeElement.scrollHeight 
        - this.conversationContainer.nativeElement.clientHeight;
    if (calculatedTop != this.conversationContainer.nativeElement.scrollTop)
    this.conversationContainer.nativeElement.scrollTop = calculatedTop;
  }

  showMenuButtons(message: IConversationMessage) {
    return message.menu !== undefined && message.menu.length > 0;
  }

  showAnswerDD(message: IConversationMessage): any {
    // const checkbox = document.getElementById('answer') as HTMLInputElement;
    // console.log("able to select ",checkbox)
    // if(checkbox!== null) {
    //   this.answerDDId = "answerDD_"+ Math.random();
    //   checkbox.id = this.answerDDId;
    // }
    // console.log("able to select ",checkbox)
    // return true;
  }

  handleMenuClick(userInput: IMessageMenu) {
    this.menuSelected.emit(userInput);
  }

  onSelectOption(event: any) {
    this.answerSelected.emit(event.target.value);
  }
  
}
