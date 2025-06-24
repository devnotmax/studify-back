import { Response } from "express";
import { AppDataSource } from "../app/config/database/connection";
import { Session } from "../models/session.model";
import { SessionType } from "../types";
import { StreakService } from "../services/streak.service";
import { User } from "../models/user.model";
import { AchievementService } from "../services/achievement.service";

const sessionRepository = AppDataSource.getRepository(Session);

interface SessionBody {
    sessionType: SessionType;
    duration: number;
    completedTime?: number;
}

interface SessionParams {
    sessionId: string;
}

interface SessionQuery {
    page?: string;
    limit?: string;
}

export const startSession = async (req: any, res: Response): Promise<void> => {
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
    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar la sesión",
            error
        });
    }
};

export const endSession = async (req: any, res: Response): Promise<void> => {
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
        const updatedStats = await StreakService.updateStreak(userId);

        // Verificar logros
        const newAchievements = await AchievementService.checkAchievements(userId);

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
    } catch (error) {
        res.status(500).json({
            message: "Error al finalizar la sesión",
            error
        });
    }
};

export const cancelSession = async (req: any, res: Response): Promise<void> => {
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
    } catch (error) {
        res.status(500).json({
            message: "Error al cancelar la sesión",
            error
        });
    }
};

export const getActiveSession = async (req: any, res: Response): Promise<void> => {
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
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener la sesión activa",
            error
        });
    }
};

export const getSessionHistory = async (req: any, res: Response): Promise<void> => {
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
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el historial de sesiones",
            error
        });
    }
};

export const getStreakInfo = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const streakInfo = await StreakService.getStreakInfo(userId);

        res.status(200).json({
            streak: streakInfo
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener la información de la racha",
            error
        });
    }
};
