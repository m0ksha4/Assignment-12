import { DBrepsitory } from "../../db.repository.js";
import { Message } from "./message.model.js";

class MessageRepository extends DBrepsitory{
    constructor(){
        super(Message)
    }
}
export const messageRepository=new MessageRepository()