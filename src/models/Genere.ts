import Model, { Schema, Types } from "../utils/Model";

const schema: Schema = {
    type: Types.String,
    required: true
}

const Genere = new Model('genres', schema)

export default Genere;