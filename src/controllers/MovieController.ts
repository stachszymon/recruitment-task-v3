import { Request, Response, NextFunction } from "express";
import { Controller, Get, Post } from "../utils/ControllerDecorators";
import Movie from "../models/Movie";
import isNumber from "../utils/isNumber"

@Controller("/movie")
export default class MovieController {

    @Get('/')
    async getAll(req: Request, res: Response, next: NextFunction) {

        //Get movies
        let movies: { [key: string]: any }[] = await Movie.find() as object[]

        //Get prams
        const { duration, genres: genere } = req.query;

        //Validate Params
        if (duration != null && isNumber(duration as string) === false) {
            throw new SyntaxError(`"duration" is not a number`)
        }
        if (genere != null && Array.isArray(genere) === false) {
            throw new SyntaxError(`"genere" is not Array`)
        }

        if (duration != null || genere != null) {
            movies = movies.filter((movie) => {
                let d, g;
                if (duration != null) {
                    const runtime = Number(movie.runtime);
                    d = runtime >= Number(duration) - 10 && runtime <= Number(duration) + 10
                }
                if (genere != undefined && movie.genres != undefined) {
                    g = (genere as string[]).some((gen: string) => movie.genres.includes(gen))
                }

                return (duration == null || d === true) && (genere == null || g === true);
            })
        }

        if (movies.length === 0) {
            return res.status(404).end();
        } else if (genere == null) {
            return res.status(200).json(movies[Math.floor(Math.random() * movies.length)])
        } else {
            movies = movies.sort((movieA, movieB) => {


                const reduceFunction = (a: number, v: any) => {
                    if ((genere as string[]).includes(v)) return a + 1;
                    return a;
                }, movieAcount = movieA.genres.reduce(reduceFunction, 0),
                    movieBcount = movieB.genres.reduce(reduceFunction, 0)
                return movieBcount - movieAcount;
            })

            return res.status(200).json(movies)
        }

    }

    @Post('/')
    async create(req: Request, res: Response, next: NextFunction) {
        const result = await Movie.create(req.body);

        res.status(201).json(result)
    }

}