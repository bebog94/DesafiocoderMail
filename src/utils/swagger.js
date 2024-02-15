import swaggerJSDoc from "swagger-jsdoc";
import {__dirname} from "./utils.js"

const swaggerOptions = { 
    definition: {
        openapi : "3.0.0",
        info: {
            title: "Hello World",
            version: "1.0.0",
            description:"API documentation"
        },
    },
    apis: [`${__dirname}/docs/*.yaml`], 
}

export const swaggerSetup = swaggerJSDoc(swaggerOptions)