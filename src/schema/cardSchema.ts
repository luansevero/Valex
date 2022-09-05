import joi from "joi";

export const createCard = joi.object({
    userId: joi.number().positive().integer().required(),
    type: joi.string().min(1).required()
});

export const cardActivation = joi.object({
    userId: joi.number().positive().integer().required(),
    password: joi.string().regex(new RegExp("^[0-9]{4}")).length(4).required(),
    CVC: joi.string().regex(new RegExp("^[0-9]{3}")).length(3).required()
});

export const toggleCardStatus = joi.object({
    userId: joi.number().positive().integer().required(),
    password: joi.string().regex(new RegExp("^[0-9]{4}")).length(4).required(),
    toBlock: joi.boolean().required()
});

export const cardBalance = joi.object({
    cardId: joi.number().positive().integer().required(),
    userId: joi.number().positive().integer().required()
})

export const cardRecharge = joi.object({
    amount: joi.number().required()
})

export const transaction = joi.object({
    cardId: joi.number().positive().integer().required(),
    password: joi.string().regex(new RegExp("^[0-9]{4}")).length(4).required(),
    businessId: joi.number().positive().integer().required(),
    amount: joi.number().positive().integer().required()
})
