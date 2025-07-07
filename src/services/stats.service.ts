import { AppDataSource } from '../app/config/database/connection';
import { Session } from '../models/session.model';
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

const COLORS = [
    '#e2d5cc', '#f1e9e3', '#c9b6a7', '#b7a69e', '#a89f91', '#d1c3b2', '#f5e9da', '#bfae9f', '#e6d3c2', '#cfc1b0'
];

export class StatsService {
    static async getProductivityHours(userId: string) {
        // Definir las franjas horarias
        const ranges = [
            { label: '00:00-03:00', start: 0, end: 3 },
            { label: '03:00-06:00', start: 3, end: 6 },
            { label: '06:00-09:00', start: 6, end: 9 },
            { label: '09:00-12:00', start: 9, end: 12 },
            { label: '12:00-15:00', start: 12, end: 15 },
            { label: '15:00-18:00', start: 15, end: 18 },
            { label: '18:00-21:00', start: 18, end: 21 },
            { label: '21:00-24:00', start: 21, end: 24 },
        ];

        // Obtener todas las sesiones completadas del usuario
        const sessionRepo = AppDataSource.getRepository(Session);
        const sessions = await sessionRepo.find({
            where: { userId, isCompleted: true, isCancelled: false },
        });

        // Inicializar el array de horas productivas por franja
        const data = Array(ranges.length).fill(0);

        for (const session of sessions) {
            const start = new Date(session.startTime);
            const end = new Date(session.endTime || session.startTime);
            let current = new Date(start);

            while (current < end) {
                const hour = current.getHours();
                const rangeIdx = ranges.findIndex(r => hour >= r.start && hour < r.end);
                if (rangeIdx !== -1) {
                    // Sumar minutos de la sesión en esa franja
                    let nextRangeHour = (ranges[rangeIdx].end === 24 ? 0 : ranges[rangeIdx].end);
                    let endOfRange = new Date(current);
                    endOfRange.setHours(nextRangeHour, 0, 0, 0);
                    let minutes = Math.min(
                        (end.valueOf() - current.valueOf()) / 60000,
                        (endOfRange.valueOf() - current.valueOf()) / 60000
                    );
                    data[rangeIdx] += minutes / 60; // convertir a horas
                    current = new Date(current.getTime() + minutes * 60000);
                } else {
                    // Si no encuentra franja, avanzar una hora
                    current.setHours(current.getHours() + 1, 0, 0, 0);
                }
            }
        }

        // Redondear a 2 decimales
        const rounded = data.map(h => Math.round(h * 100) / 100);
        return {
            labels: ranges.map(r => r.label),
            datasets: [
                {
                    label: 'Horas productivas',
                    data: rounded,
                    backgroundColor: COLORS[0],
                    borderColor: COLORS[0],
                    fill: true
                }
            ]
        };
    }

    static async getWeeklyProductivity(userId: string) {
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1); // Lunes
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        const sessionRepo = AppDataSource.getRepository(Session);
        const sessions = await sessionRepo.find({
            where: {
                userId,
                isCompleted: true,
                isCancelled: false,
                startTime: Between(weekStart, weekEnd)
            }
        });
        const data = Array(7).fill(0);
        for (const session of sessions) {
            const day = new Date(session.startTime).getDay();
            const idx = (day + 6) % 7; // Lunes=0, Domingo=6
            data[idx] += session.completedTime / 60;
        }
        return {
            labels: days,
            datasets: [
                {
                    label: 'Horas por día',
                    data,
                    backgroundColor: COLORS[1],
                    borderColor: COLORS[1],
                    fill: true
                }
            ]
        };
    }

    static async getTypeDistribution(userId: string) {
        const sessionRepo = AppDataSource.getRepository(Session);
        const sessions = await sessionRepo.find({ where: { userId, isCompleted: true, isCancelled: false } });
        const typeMap: Record<string, number> = {};
        for (const session of sessions) {
            typeMap[session.sessionType] = (typeMap[session.sessionType] || 0) + 1;
        }
        const labels = Object.keys(typeMap);
        const data = labels.map(l => typeMap[l]);
        return {
            labels,
            datasets: [
                {
                    label: 'Sesiones',
                    data,
                    backgroundColor: COLORS.slice(0, labels.length)
                }
            ]
        };
    }

    static async getDailyHistory(userId: string, days: number) {
        const sessionRepo = AppDataSource.getRepository(Session);
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - days + 1);
        start.setHours(0, 0, 0, 0);
        const sessions = await sessionRepo.find({
            where: {
                userId,
                isCompleted: true,
                isCancelled: false,
                startTime: MoreThanOrEqual(start)
            }
        });
        const labels: string[] = [];
        const data: number[] = [];
        for (let i = 0; i < days; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const label = d.toISOString().slice(0, 10);
            labels.push(label);
            const count = sessions.filter(s => new Date(s.startTime).toISOString().slice(0, 10) === label).length;
            data.push(count);
        }
        return {
            labels,
            datasets: [
                {
                    label: 'Sesiones completadas',
                    data,
                    backgroundColor: COLORS[2],
                    borderColor: COLORS[2],
                    fill: true
                }
            ]
        };
    }

    static async getMonthlyProductivity(userId: string) {
        const sessionRepo = AppDataSource.getRepository(Session);
        const now = new Date();
        const year = now.getFullYear();
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const data = Array(12).fill(0);
        const sessions = await sessionRepo.find({
            where: {
                userId,
                isCompleted: true,
                isCancelled: false,
                startTime: MoreThanOrEqual(new Date(year, 0, 1))
            }
        });
        for (const session of sessions) {
            const month = new Date(session.startTime).getMonth();
            data[month] += session.completedTime / 60;
        }
        return {
            labels: months,
            datasets: [
                {
                    label: 'Horas por mes',
                    data,
                    backgroundColor: COLORS[3],
                    borderColor: COLORS[3],
                    fill: true
                }
            ]
        };
    }

    static async getStreak(userId: string) {
        const sessionRepo = AppDataSource.getRepository(Session);
        const sessions = await sessionRepo.find({
            where: { userId, isCompleted: true, isCancelled: false },
            order: { endTime: 'ASC' }
        });
        let currentStreak = 0;
        let longestStreak = 0;
        let lastActivityDate = null;
        let prevDate: Date | null = null;
        for (const session of sessions) {
            const sessionDate = new Date(session.endTime || session.startTime);
            sessionDate.setHours(0, 0, 0, 0);
            if (!prevDate) {
                currentStreak = 1;
                longestStreak = 1;
            } else {
                const diff = (sessionDate.valueOf() - prevDate.valueOf()) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    currentStreak++;
                    if (currentStreak > longestStreak) longestStreak = currentStreak;
                } else if (diff > 1) {
                    currentStreak = 1;
                }
            }
            prevDate = sessionDate;
            lastActivityDate = sessionDate.toISOString().slice(0, 10);
        }
        return {
            currentStreak,
            longestStreak,
            lastActivityDate
        };
    }

    static async getAverageSessionDuration(userId: string) {
        const sessionRepo = AppDataSource.getRepository(Session);
        const sessions = await sessionRepo.find({ where: { userId, isCompleted: true, isCancelled: false } });
        if (sessions.length === 0) {
            return { overall: 0 };
        }
        const totalMinutes = sessions.reduce((acc, s) => acc + (s.completedTime / 60), 0);
        const avg = Math.round((totalMinutes / sessions.length) * 10) / 10;
        return { overall: avg };
    }

    static async getSessionStatus(userId: string) {
        const sessionRepo = AppDataSource.getRepository(Session);
        const sessions = await sessionRepo.find({ where: { userId } });
        const statusMap: Record<string, number> = {
            'Completadas': 0,
            'Canceladas': 0,
            'Pausadas': 0
        };
        for (const s of sessions) {
            if (s.isCompleted) statusMap['Completadas']++;
            else if (s.isCancelled) statusMap['Canceladas']++;
            else if (s.isPaused) statusMap['Pausadas']++;
        }
        const labels = Object.keys(statusMap);
        const data = labels.map(l => statusMap[l]);
        return {
            labels,
            datasets: [
                {
                    label: 'Sesiones',
                    data,
                    backgroundColor: COLORS.slice(0, labels.length)
                }
            ]
        };
    }

    static async getWeeklyInMonth(userId: string) {
        const sessionRepo = AppDataSource.getRepository(Session);
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const sessions = await sessionRepo.find({
            where: {
                userId,
                isCompleted: true,
                isCancelled: false,
                startTime: Between(firstDay, lastDay)
            }
        });
        const weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'];
        const data = Array(5).fill(0);
        for (const session of sessions) {
            const date = new Date(session.startTime);
            const week = Math.floor((date.getDate() - 1) / 7);
            data[week]++;
        }
        return {
            labels: weeks,
            datasets: [
                {
                    label: 'Sesiones por semana',
                    data,
                    backgroundColor: COLORS[4],
                    borderColor: COLORS[4],
                    fill: true
                }
            ]
        };
    }
} 