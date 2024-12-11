import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConversationComponent } from '../conversation/conversation.component';
import { MatIconModule } from '@angular/material/icon';
import { PromptComponent } from './app-prompt/prompt.component';
import { ChatBotService } from './chatbot-service';
import { HttpClientModule } from '@angular/common/http';
import { IConversationMessage } from '../interfaces/conversation-message';
import { IQuestion } from '../interfaces/iquestion';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule,
    HttpClientModule,
    ConversationComponent,
    PromptComponent,
    MatIconModule],
  standalone: true,
  providers: [ChatBotService],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  public messages: IConversationMessage[] = [];
  public questions: IQuestion[] = [];
  chatboxOpen: boolean = true;
  isQuestionType: boolean = false;
  questionId: number = 1;
  selectedAnswer: string = ''

  constructor(private chatBotService: ChatBotService) {}

  ngOnInit() {
    this.messages = this.chatBotService.messages;
    this.submitUserInput('hi');
  }

  toggleChatbox() {
    this.chatboxOpen = !this.chatboxOpen;
  }

  handlePromptChange($event: any) {
    this.messages.push({
        from: 'user',
        message: $event,
        avatar: "assets/user.png" 
      });
      this.submitUserInput($event);    
  }

  private submitUserInput($event: any) {
    if(this.isQuestionType) {
      this.handleAnswerSubmit($event);
    } else{
      this.submitPromptInput($event);
    }
    this.disableCurrentAnswer($event);
  }

  disableCurrentAnswer($event: any) {
    const el: HTMLInputElement = document.querySelector("[value='"+ $event +"']")?.parentNode as HTMLInputElement;
    if(el !== undefined) {
      el.disabled = true;
    }
  }

  private submitPromptInput($event: any) {
    if(this.isValidInput($event)) {
      this.chatBotService.submitPrompt($event).subscribe({
        next: (res) => {
          setTimeout(() => {
            this.messages.push({
              from: 'bot',
              message: res.message,
              menu: res.menus,
              avatar: "assets/file.png"            
            })}, 500);
        },
        error: (err) => {
          setTimeout(() => {
            this.messages.push({
              from: 'bot',
              message: err.error?.error?.message
            });
          }, 500);
      }});
    } else {
      this.messages.push({
        from: 'bot',
        message: "Unable to understand",            
      });
    }
    
  }

  isValidInput($event: any) : boolean {
    return $event.toLowerCase() === "hi" || $event.toLowerCase() === "hello"
  }

  private handleAnswerSubmit($event: any) {
    this.chatBotService.questions.forEach(que => {
        if(Number(que.questionId) === this.questionId) {
          que.answer = $event;
        }
      });
      this.questions = this.questions.filter(que => Number(que.questionId) !== this.questionId);
      if(this.questions.length > 0) {
        this.questionId++;
        this.questions.forEach(que => {
        if(Number(que.questionId) === this.questionId) {
          this.messages.push({
            from: 'bot',
            message: que.question,
            options: que.values,
            answerType: que.uiControlType,
            avatar: "assets/file.png"         
          });
        }
      });
      } else {
        this.submitAnswers();
    }
  }

  private submitAnswers() {
    this.chatBotService.submitAnswers().subscribe({
      next: (res) => {
        setTimeout(() => {
          this.messages.push({
            from: 'bot',
            message: res.message,
            menu: res.menus,
            avatar: "assets/file.png"            
          })}, 500);
      },
      error: (err) => {
        setTimeout(() => {
          this.messages.push({
            from: 'bot',
            message: err.error?.error?.message
          });
        }, 500);
      }
    });
    this.questionId = 1;
    this.questions = [];
    this.chatBotService.questions = [];
    this.isQuestionType = false;
  }

  handleMenuSelection($event: any) {
    this.messages.push({
        from: 'user',
        message: $event.name,
        avatar: "assets/user.png" 
    });
    this.chatBotService.submitMenuSelection($event.id).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.chatBotService.questions = res;
          this.questions = res;
          res.forEach(obj => {
            if(Number(obj.questionId) === this.questionId) {
              this.messages.push({
                from: 'bot',
                message: obj.question,
                options: obj.values,
                answerType: obj.uiControlType,  
                avatar: "assets/file.png"       
              });
              this.isQuestionType = true;
            }
          })}, 500);
      },
      error: (err) => {
        setTimeout(() => {
          this.messages.push({
            from: 'bot',
            message: err.error?.error?.message
          });
        }, 500);
    }});
  }

  handleAnswerSelection($event: string) {
    this.selectedAnswer = $event;
  }
}

