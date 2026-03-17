import { DBrepsitory } from "../../db.repository.js";
import { Token } from "./token.model.js";

class TokenRepository extends DBrepsitory{
    constructor(){
        super(Token)
    }
}
export const tokenRepository=new TokenRepository()