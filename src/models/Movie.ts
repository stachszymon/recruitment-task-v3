import { Schemas, Types } from './../interfaces/IModel';
import { createModel } from "../utils/Model";
import { validateNumberType, validateStringMax } from "../utils/validationFunctions"
import Genere from "./Genere";

const schema: Schemas = {
    id: {
        type: Types.Number,
        required: true,
    },
    title: {
        type: Types.String,
        required: true,
        validation: validateStringMax("title"),
    },
    year: {
        type: Types.String,
        required: true,
        validation: validateNumberType("year"),

    },
    runtime: {
        type: Types.String,
        required: true,
        validation: validateNumberType("runtime"),
    },
    director: {
        type: Types.String,
        required: true,
        validation: validateStringMax("director"),
    },
    actors: {
        type: Types.String,
    },
    plot: {
        type: Types.String,
    },
    posterUrl: {
        type: Types.String
    },
    genres: {
        type: Types.Array,
        validation: async value => {
            const g = await Genere.find(value);
            if (g[0] == null) return [`Can't find "Genere"`]
            return []
        }
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

const Movie = createModel('movies', schema, false);

export default Movie;