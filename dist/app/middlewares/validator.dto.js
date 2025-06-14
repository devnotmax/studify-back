"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateDTO;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
require("reflect-metadata");
function validateDTO(dtoClass) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const dto = (0, class_transformer_1.plainToClass)(dtoClass, req.body);
        const errors = yield (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }
        next();
    });
}
