import { DBrepsitory } from "../../db.repository.js";
import { User } from "./users.model.js";

class UserRepsitory extends DBrepsitory{
    constructor(){
   super(User)
    }
}
export const userRepsitory=new UserRepsitory()
