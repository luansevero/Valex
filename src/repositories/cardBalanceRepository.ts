import { number } from "joi";
import { connection } from "../setup/database.js";

export async function cardBalance(cardId:number){
    const { rows:balance } = await connection.query(`
        SELECT COALESCE(SUM(recharges.amount) - SUM(payments.amount), 0) as balance,
        (
            SELECT
            ARRAY_AGG(
                jsonb_build_object(
                    'id', p.id,
                    'cardId', p."cardId",
                    'businessId', p."businessId",
                    'businessName', b.name,
                    'timestamp', p.timestamp,
                    'amount', p.amount
                )
            )
            FROM payments p
            JOIN businesses b
            ON p."businessId" = b.id
        ) as transactions,
        (
            SELECT
            ARRAY_AGG(
                jsonb_build_object(
                    'id', r.id,
                    'cardId', r."cardId",
                    'timestamp', r.timestamp,
                    'amount', r.amount
                )
            )
            FROM recharges r
        ) as recharges
        FROM card
        JOIN payments
        ON payments."cardId" = $1
        JOIN recharges
        ON recharges."cardId" = $1
        WHERE id = $1
    `, [cardId]);
    return balance;
};

export async function amount(cardId:number){
    const {rows:amount} = await connection.query(`
        SELECT COALESCE(SUM(recharges.amount) - SUM(payments.amount), 0) as balance
        FROM card
        JOIN payments
        ON payments."cardId" = $1
        JOIN recharges
        ON recharges."cardId" = $1
        WHERE id = $1
    `, [cardId]);
    return amount["balance"]
};