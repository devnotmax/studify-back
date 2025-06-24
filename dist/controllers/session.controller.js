"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreakInfo = exports.getSessionHistory = exports.getActiveSession = exports.cancelSession = exports.endSession = exports.startSession = void 0;
const connection_1 = require("../app/config/database/connection");
const session_model_1 = require("../models/session.model");
const streak_service_1 = require("../services/streak.service");
const achievement_service_1 = require("../services/achievement.service");
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
    try {
        const { sessionId } = req.params;
        const { completedTime } = req.body;
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
        res.status(500).json({
            message: "Error al finalizar la sesión",
            error
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
