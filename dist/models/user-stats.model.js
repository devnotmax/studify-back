"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStats = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
let UserStats = class UserStats {
};
exports.UserStats = UserStats;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserStats.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserStats.prototype, "totalSessions", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserStats.prototype, "totalTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserStats.prototype, "averageSessionDuration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserStats.prototype, "longestSession", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], UserStats.prototype, "longestSessionDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserStats.prototype, "totalFocusTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserStats.prototype, "totalBreakTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserStats.prototype, "totalLongBreakTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, (user) => user.stats),
    __metadata("design:type", user_model_1.User)
], UserStats.prototype, "user", void 0);
exports.UserStats = UserStats = __decorate([
    (0, typeorm_1.Entity)("user_stats")
], UserStats);
