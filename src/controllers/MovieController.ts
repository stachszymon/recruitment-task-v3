import { Request, Response, NextFunction } from "express";
import { get } from "http";
import { Controller, Get } from "../utils/ControllerDecorators";

@Controller("/movie")
export default class MovieController {

    @Get('/')
    getAll(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({ success: true })
    }

}