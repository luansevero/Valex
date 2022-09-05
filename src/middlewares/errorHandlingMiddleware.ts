import express from "express";
import "express-async-errors";
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
;

export default function errorHandling(error:ErrorRequestHandler, req:Request, res:Response, next:NextFunction){
}