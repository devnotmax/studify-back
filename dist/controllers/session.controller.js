"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionStats = exports.getStreakInfo = exports.getSessionHistory = exports.getActiveSession = exports.cancelSession = exports.endSession = exports.startSession = void 0;
const connection_1 = require("../app/config/database/connection");
const session_model_1 = require("../models/session.model");
const streak_service_1 = require("../services/streak.service");
const achievement_service_1 = require("../services/achievement.service");
const typeorm_1 = require("typeorm");
const sessionRepository = connection_1.AppDataSource.getRepository(session_model_1.Session);
const startSession = async (req, res) => {
    try {
        const { sessionType, duration } = req.body;
        const userId = req.user.id;
        const activeSession = await sessionRepository.findOne({
            where: {
                userId,
                isCompleted: false,
                isCancelled: false
            }
        });
        if (activeSession) {
            res.status(400).json({
                message: "Ya existe una sesión activa"
            });
            return;
        }
        const session = sessionRepository.create({
            sessionType,
            duration,
            userId,
            startTime: new Date(),
            completedTime: 0,
            isCompleted: false,
            isCancelled: false
        });
        await sessionRepository.save(session);
        res.status(201).json({
            message: "Sesión iniciada correctamente",
            session
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al iniciar la sesión",
            error
        });
    }
};
exports.startSession = startSession;
const endSession = async (req, res) => {
    var _a, _b, _c;
    try {
        console.log("Iniciando endSession con:", {
            sessionId: req.params.sessionId,
            completedTime: req.body.completedTime,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        });
        const { sessionId } = req.params;
        const { completedTime } = req.body;
        const userId = req.user.id;
        console.log("Buscando sesión con ID:", sessionId, "para usuario:", userId);
        const session = await sessionRepository.findOne({
            where: {
                id: sessionId,
                userId
            }
        });
        console.log("Sesión encontrada:", session ? "Sí" : "No");
        if (!session) {
            res.status(404).json({
                message: "Sesión no encontrada"
            });
            return;
        }
        session.isCompleted = true;
        session.completedTime = completedTime;
        session.endTime = new Date();
        await sessionRepository.save(session);
        // Actualizar la racha del usuario
        const updatedStats = await streak_service_1.StreakService.updateStreak(userId);
        // Verificar logros
        const newAchievements = await achievement_service_1.AchievementService.checkAchievements(userId);
        res.status(200).json({
            message: "Sesión finalizada correctamente",
            session,
            streak: {
                currentStreak: updatedStats.currentStreak,
                longestStreak: updatedStats.longestStreak,
                lastActivityDate: updatedStats.lastActivityDate
            },
            newAchievements
        });
    }
    catch (error) {
        console.error("Error detallado al finalizar sesión:", {
            error: error,
            message: error === null || error === void 0 ? void 0 : error.message,
            stack: error === null || error === void 0 ? void 0 : error.stack,
            userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            sessionId: req.params.sessionId
        });
        res.status(500).json({
            message: "Error al finalizar la sesión",
            error: {
                message: (error === null || error === void 0 ? void 0 : error.message) || "Error desconocido",
                type: ((_c = error === null || error === void 0 ? void 0 : error.constructor) === null || _c === void 0 ? void 0 : _c.name) || "Unknown"
            }
        });
    }
};
exports.endSession = endSession;
const cancelSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;
        const session = await sessionRepository.findOne({
            where: {
                id: sessionId,
                userId
            }
        });
        if (!session) {
            res.status(404).json({
                message: "Sesión no encontrada"
            });
            return;
        }
        session.isCancelled = true;
        session.endTime = new Date();
        await sessionRepository.save(session);
        res.status(200).json({
            message: "Sesión cancelada correctamente",
            session
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al cancelar la sesión",
            error
        });
    }
};
exports.cancelSession = cancelSession;
const getActiveSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const session = await sessionRepository.findOne({
            where: {
                userId,
                isCompleted: false,
                isCancelled: false
            }
        });
        res.status(200).json({
            session
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener la sesión activa",
            error
        });
    }
};
exports.getActiveSession = getActiveSession;
const getSessionHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const [sessions, total] = await sessionRepository.findAndCount({
            where: {
                userId
            },
            order: {
                startTime: "DESC"
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });
        res.status(200).json({
            sessions,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener el historial de sesiones",
            error
        });
    }
};
exports.getSessionHistory = getSessionHistory;
const getStreakInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const streakInfo = await streak_service_1.StreakService.getStreakInfo(userId);
        res.status(200).json({
            streak: streakInfo
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener la información de la racha",
            error
        });
    }
};
exports.getStreakInfo = getStreakInfo;
const getSessionStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo como inicio de semana
        startOfWeek.setHours(0, 0, 0, 0);
        // Sesiones completadas y no canceladas
        const total = await sessionRepository.count({
            where: {
                userId,
                isCompleted: true,
                isCancelled: false
            }
        });
        const todayCount = await sessionRepository.count({
            where: {
                userId,
                isCompleted: true,
                isCancelled: false,
                startTime: (0, typeorm_1.MoreThanOrEqual)(startOfToday)
            }
        });
        const weekCount = await sessionRepository.count({
            where: {
                userId,
                isCompleted: true,
                isCancelled: false,
                startTime: (0, typeorm_1.MoreThanOrEqual)(startOfWeek)
            }
        });
        res.status(200).json({
            today: todayCount,
            week: weekCount,
            total
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener las estadísticas de sesiones",
            error
        });
    }
};
exports.getSessionStats = getSessionStats;
