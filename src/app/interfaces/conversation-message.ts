import { IMessageMenu } from "./imessage-menu";

export interface IConversationMessage {
    message: string;
    menu?: IMessageMenu[];
    options?: string[];
    answerType?: string;
    from: string;
    avatar?: string;
}