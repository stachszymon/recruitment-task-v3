import Model, { Schemas, Types } from "../utils/Model";

const schema : Schemas = {
    title: {
        type: Types.String,
        required: true,
        validation: () => true,
    },
    year: {
        type: Types.Number,
        required: true,
    },
    runtime: {
        type: Types.Number,
        required: true,
    },
    director: {
        type: Types.String,
        required: true,
    },
    actors: {
        type: Types.String,
    },
    plot: {
        type: Types.String,
    },
    posterUrl: {
        type: Types.String
    }
}

/*
- a list of genres (only predefined ones from db file) (required, array of predefined strings)
- title (required, string, max 255 characters)
- year (required, number)
- runtime (required, number)
- director (required, string, max 255 characters)
- actors (optional, string)
- plot (optional, string)
- posterUrl (optional, string)
 */

const Movie = new Model('movies', schema);

export default Movie;