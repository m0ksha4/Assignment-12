import { DBrepsitory } from "../../db.repository.js";
import { Note } from "./note.model.js";

class NoteRepository extends DBrepsitory{
    constructor(){
        super(Note)
    }
}
export const noteRepository=new NoteRepository()