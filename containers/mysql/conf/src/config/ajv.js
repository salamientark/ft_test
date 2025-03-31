import Ajv from "ajv";
import register_schema from "./ajv_schemas/register.json" with { type: "json" };
import login_schema from "./ajv_schemas/login.json" with { type: "json" };

const ajv = new Ajv();

ajv.addSchema(register_schema, "register");
ajv.addSchema(login_schema, "login");

export default ajv;
