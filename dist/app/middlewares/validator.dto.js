"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateDTO;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
require("reflect-metadata");
function validateDTO(dtoClass) {
    return async (req, res, next) => {
        const dto = (0, class_transformer_1.plainToClass)(dtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        next();
    };
}
