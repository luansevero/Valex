import { Request, Response, NextFunction } from 'express'
import { ErrorInfo } from './errorHandlingMiddleware.js';
import { apiKeySchema } from '../schema/apikeySchema.js';

export default function verifyApiKey(req:Request, res:Response, next:NextFunction){
    const apiKey: string | string[] = req.headers["x-api-key"];
    const validation = apiKeySchema.validate({apiKey}, {abortEarly: false})
    if(validation.error) throw new ErrorInfo("error_unprocessable_entity", "Api Key Missing");
    res.locals.apiKey = apiKey;
    next();
};