import Ajv from "ajv";
import register_schema from "./ajv_schemas/register.json" with { type: "json" };

const ajv = new Ajv();

ajv.addSchema(register_schema, "register");

export default ajv;
