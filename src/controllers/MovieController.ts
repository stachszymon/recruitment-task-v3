import { Request, Response, NextFunction } from "express";

export default class MovieController {

    static getAll(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({ success: true })
    }

}