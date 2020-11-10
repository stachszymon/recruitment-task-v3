import { Schema, Types, createModel } from "../utils/Model";

const schema: Schema = {
    type: Types.String,
    required: true
}

const Genere = createModel('genres', schema)

export default Genere;