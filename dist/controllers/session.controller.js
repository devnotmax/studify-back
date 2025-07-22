"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionRemaining = exports.resumeSession = exports.pauseSession = exports.getSessionStats = exports.getStreakInfo = exports.getSessionHistory = exports.getActiveSession = exports.cancelSession = exports.endSession = exports.startSession = void 0;
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
                isCancelled: false,
            },
        });
        if (activeSession) {
            res.status(400).json({
                message: "Ya existe una sesión activa",
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
            isCancelled: false,
        });
        await sessionRepository.save(session);
        res.status(201).json({
            message: "Sesión iniciada correctamente",
            session,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al iniciar la sesión",
            error,
        });
    }
};
exports.startSession = startSession;
const endSession = async (req, res) => {
    var _a;
    try {
        const { sessionId } = req.params;
        const { completedTime } = req.body;
        const userId = req.user.id;
        const session = await sessionRepository.findOne({
            where: { id: sessionId, userId },
        });
        if (!session) {
            res.status(404).json({ message: "Sesión no encontrada" });
            return;
        }
        // Calcular tiempo real transcurrido
        let elapsed = session.elapsedBeforePause;
        if (!session.isPaused) {
            elapsed += Math.floor((new Date().getTime() - new Date(session.startTime).getTime()) / 1000);
        }
        const remaining = Math.max(0, session.duration - elapsed);
        if (remaining > 0) {
            res
                .status(400)
                .json({ message: "No se puede finalizar la sesión, aún queda tiempo" });
            return;
        }
        session.isCompleted = true;
        session.completedTime = completedTime;
        session.endTime = new Date();
        await sessionRepository.save(session);
        await require("../services/stats.service").StatsService.updateUserStats(userId, session);
        const updatedStats = await streak_service_1.StreakService.updateStreak(userId);
        const newAchievements = await achievement_service_1.AchievementService.checkAchievements(userId);
        res.status(200).json({
            message: "Sesión finalizada correctamente",
            session,
            streak: {
                currentStreak: updatedStats.currentStreak,
                longestStreak: updatedStats.longestStreak,
                lastActivityDate: updatedStats.lastActivityDate,
            },
            newAchievements,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al finalizar la sesión",
            error: {
                message: (error === null || error === void 0 ? void 0 : error.message) || "Error desconocido",
                type: ((_a = error === null || error === void 0 ? void 0 : error.constructor) === null || _a === void 0 ? void 0 : _a.name) || "Unknown",
            },
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
                userId,
            },
        });
        if (!session) {
            res.status(404).json({
                message: "Sesión no encontrada",
            });
            return;
        }
        session.isCancelled = true;
        session.endTime = new Date();
        await sessionRepository.save(session);
        res.status(200).json({
            message: "Sesión cancelada correctamente",
            session,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al cancelar la sesión",
            error,
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
                isCancelled: false,
            },
        });
        res.status(200).json({
            session,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener la sesión activa",
            error,
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
                userId,
            },
            order: {
                startTime: "DESC",
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });
        res.status(200).json({
            sessions,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener el historial de sesiones",
            error,
        });
    }
};
exports.getSessionHistory = getSessionHistory;
const getStreakInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const streakInfo = await streak_service_1.StreakService.getStreakInfo(userId);
        res.status(200).json({
            streak: streakInfo,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener la información de la racha",
            error,
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
                isCancelled: false,
            },
        });
        const todayCount = await sessionRepository.count({
            where: {
                userId,
                isCompleted: true,
                isCancelled: false,
                startTime: (0, typeorm_1.MoreThanOrEqual)(startOfToday),
            },
        });
        const weekCount = await sessionRepository.count({
            where: {
                userId,
                isCompleted: true,
                isCancelled: false,
                startTime: (0, typeorm_1.MoreThanOrEqual)(startOfWeek),
            },
        });
        res.status(200).json({
            today: todayCount,
            week: weekCount,
            total,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener las estadísticas de sesiones",
            error,
        });
    }
};
exports.getSessionStats = getSessionStats;
const pauseSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;
        const session = await sessionRepository.findOne({
            where: { id: sessionId, userId },
        });
        if (!session) {
            res.status(404).json({ message: "Sesión no encontrada" });
            return;
        }
        if (session.isCompleted || session.isCancelled) {
            res
                .status(400)
                .json({
                message: "No se puede pausar una sesión finalizada o cancelada",
            });
            return;
        }
        if (session.isPaused) {
            res.status(400).json({ message: "La sesión ya está pausada" });
            return;
        }
        const now = new Date();
        // Calcular tiempo transcurrido hasta la pausa
        const elapsed = session.elapsedBeforePause + Math.floor((now.getTime() - new Date(session.startTime).getTime()) / 1000);
        session.isPaused = true;
        session.pausedAt = now;
        session.elapsedBeforePause = elapsed;
        session.completedTime = elapsed;
        await sessionRepository.save(session);
        res.status(200).json({ message: "Sesión pausada", session });
    }
    catch (error) {
        res.status(500).json({ message: "Error al pausar la sesión", error });
    }
};
exports.pauseSession = pauseSession;
const resumeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;
        const session = await sessionRepository.findOne({
            where: { id: sessionId, userId },
        });
        if (!session) {
            res.status(404).json({ message: "Sesión no encontrada" });
            return;
        }
        if (session.isCompleted || session.isCancelled) {
            res
                .status(400)
                .json({
                message: "No se puede reanudar una sesión finalizada o cancelada",
            });
            return;
        }
        if (!session.isPaused) {
            res.status(400).json({ message: "La sesión no está pausada" });
            return;
        }
        // Ajustar startTime para descontar el tiempo en pausa
        if (session.pausedAt) {
            const pauseDuration = Math.floor((new Date().getTime() - new Date(session.pausedAt).getTime()) / 1000);
            session.startTime = new Date(session.startTime.getTime() + pauseDuration * 1000);
        }
        session.isPaused = false;
        session.pausedAt = null;
        await sessionRepository.save(session);
        res.status(200).json({ message: "Sesión reanudada", session });
    }
    catch (error) {
        res.status(500).json({ message: "Error al reanudar la sesión", error });
    }
};
exports.resumeSession = resumeSession;
const getSessionRemaining = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;
        const session = await sessionRepository.findOne({
            where: { id: sessionId, userId },
        });
        if (!session) {
            res.status(404).json({ message: "Sesión no encontrada" });
            return;
        }
        let elapsed = session.elapsedBeforePause;
        if (!session.isPaused) {
            elapsed += Math.floor((new Date().getTime() - new Date(session.startTime).getTime()) / 1000);
        }
        const remaining = Math.max(0, session.duration - elapsed);
        res.status(200).json({ remaining });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error al obtener el tiempo restante", error });
    }
};
exports.getSessionRemaining = getSessionRemaining;
