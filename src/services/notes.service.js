import sequelize, { DataTypes } from '../config/database';
const Notes = require('../models/notes')(sequelize, DataTypes);
import HttpStatus from 'http-status-codes';
// import dotenv from 'dotenv';


export const createNote = async (notesData) => {

    try {
        const data = await Notes.create(notesData);

        return {
            code: HttpStatus.OK,
            data: data,
            message: "Notes created 🎉"
        }
    } catch (error) {
        console.log(error);
        return {
            code: HttpStatus.BAD_GATEWAY,
            data: [],
            message: "notes creation unsuccessful"
        }
    }
}
export const readAllNote = async () => {

    try {

        const data = await Notes.findAll()
        return {
            code: HttpStatus.OK,
            data: data,
            message: "data fetched 👍"
        };

    } catch (error) {
        console.log(error);
        return {
            code: HttpStatus.BAD_GATEWAY,
            data: [],
            message: "unsuccessful"
        }
    }
}
export const readById = async (id) => {
    try {
        const data = await Notes.findByPk(id);
        return {
            code: HttpStatus.OK,
            data: data,
            message: "data fetched 👍"
        }
    } catch (error) {
        console.log("-->", error);
        return {
            code: HttpStatus.BAD_GATEWAY,
            data: [],
            message: "unsuccessful"
        }
    }
}
export const deleteNote = async (id) => {
    console.log("-->", id);
    await Notes.destroy({ where: { id: id } });
    return {
        code: HttpStatus.OK,
        data: data,
        message: "Note deleted 😵"
    }
}