import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IConversationMessage } from '../interfaces/conversation-message';
import { IMessageMenu } from "../interfaces/imessage-menu";
import { IQuestion } from '../interfaces/iquestion';

const apiUrl: string = 'http://localhost:8080/api/connectmaster/v1';
const apiKey: string = 'YOUR_OPENAI_API_KEY';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
    public messages: IConversationMessage[] =     [];
    public questions: IQuestion[] = [];
    public menuSelected: string = '';

  constructor(private http: HttpClient) {}

  submitPrompt(userInput: string): Observable<any> {
    let url = apiUrl+'/menu';
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    
    return this.http.get<any>(url, {headers});
  }

  submitMenuSelection(userInput: string): Observable<IQuestion[]> {
    this.menuSelected = userInput;
    let url = apiUrl + `/questions/${userInput}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    return this.http.get<IQuestion[]>(url, {headers});
  }

  submitAnswers() : Observable<any> {
    let url = apiUrl + "/questions";
    const body: any = {
      "id":this.menuSelected,
      "questions": this.questions
    }
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${apiKey}`);
    
    return this.http.post<any>(url, body, {headers});
  }

  
}
