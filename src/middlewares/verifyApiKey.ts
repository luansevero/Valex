import { Request, Response, NextFunction } from 'express'

export default function verifyApiKey(req:Request, res:Response, next:NextFunction){
    const apiKey: string | string[] = req.headers["x-api-key"];
    if(apiKey === "" || !apiKey){
        throw{
            type: "erro_missing_api_key",
            messae: "Api key missing"
        }
    };

    res.locals.apiKey = apiKey;
    next();
}