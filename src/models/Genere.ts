import { Types, Schema } from './../interfaces/IModel';
import { createModel } from "../utils/Model";

const schema: Schema = {
    type: Types.String,
    required: true
}

const Genere = createModel('genres', schema)

export default Genere;