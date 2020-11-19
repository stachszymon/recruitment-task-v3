import { Request, Response, NextFunction } from "express";
import { Controller, Get, Post } from "../utils/ControllerDecorators";
import Movie from "../models/Movie";

@Controller("/movie")
export default class MovieController {

    @Get('/')
    async getAll(req: Request, res: Response, next: NextFunction) {
        const movies = await Movie.find();

        console.log(req.query)

        res.status(200).json(movies)
    }

    @Post('/')
    async create(req: Request, res: Response, next: NextFunction) {
        const result = await Movie.create(req.body);

        res.status(201).json(result)
    }

}