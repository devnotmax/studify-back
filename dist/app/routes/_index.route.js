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
const auth_routes_1 = __importDefault(require("../../routes/auth.routes"));
const session_routes_1 = __importDefault(require("../../routes/session.routes"));
const router = express_1.default.Router();
// Health check para Render
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
router.use('/post', post_route_1.default);
router.use('/get', get_route_1.default);
router.use('/patch', patch_route_1.default);
router.use('/put', put_route_1.default);
router.use('/delete', delete_route_1.default);
router.use('/auth', auth_routes_1.default);
router.use('/sessions', session_routes_1.default);
console.log('Rutas de sesión montadas en /api/sessions');
exports.default = router;
