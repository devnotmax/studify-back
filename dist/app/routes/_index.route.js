"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_route_1 = __importDefault(require("./post.route"));
const get_route_1 = __importDefault(require("./get.route"));
const patch_route_1 = __importDefault(require("./patch.route"));
const put_route_1 = __importDefault(require("./put.route"));
const delete_route_1 = __importDefault(require("./delete.route"));
const router = (0, express_1.default)();
router.use('/post', post_route_1.default);
router.use('/get', get_route_1.default);
router.use('/patch', patch_route_1.default);
router.use('/put', put_route_1.default);
router.use('/delete', delete_route_1.default);
exports.default = router;
