import joi from "joi";

export const apiKeySchema = joi.object({
    apiKey: joi.string().min(1).required()
});
