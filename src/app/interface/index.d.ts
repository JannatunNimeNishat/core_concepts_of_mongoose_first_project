/**Request object er modde amra akta new property dukate casci namespace er maddome. jate accessToken verify hoa user er data amra Request object er modde amader pura app er sob jaiga tekai access korte pari */

import { JwtPayload } from "jsonwebtoken";

declare global{
    namespace Express{
        interface Request{
            user:JwtPayload;
        }
    }
}