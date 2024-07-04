import redis from 'ioredis';
import HttpStatus from 'http-status-codes';
import sequelize, { DataTypes } from '../../src/config/database';

const Note = require('../../src/models/notes')(sequelize, DataTypes);
const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

export const getCacheKey = (userId) => `notes:${userId}`;

export const catchAllNotes = async (userId) => {
    const notes = await Note.findAll({ where: { userId: userId } });
    console.log("-->notes", notes);
    const cacheKey = getCacheKey(userId);
    await redisClient.set(cacheKey, JSON.stringify(notes), 'EX', 3600);
}
export const deleteAllCachedNote = async (userId) => {
    const cacheKey = getCacheKey(userId);
    await redisClient.del(cacheKey);
}
export const getAllCatchedNotes = async (req, res, next) => {
    const userId = req.body.userId;
    const cacheKey = getCacheKey(userId);
    try {
        const data = await redisClient.get(cacheKey);
        if (data === null) {
            return next(); // No data in cache, proceed to the next middleware
        }
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            data: JSON.parse(data),
            message: 'fetched notes from redis successfully'
        });
    } catch (err) {
        // Handle Redis errors here
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error fetching notes from cache'
        });
    }

}