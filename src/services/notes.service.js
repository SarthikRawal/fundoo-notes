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
            message: "Notes creation unsuccessful"
        }
    }
}
export const getAllNote = async (userId) => {
    try {
        console.log("-->", userId);
        const data = await Notes.findAll({ where: { userId: userId } })
        console.log("-->", data.userId);
        if (data) {
            // Note found
            return {
                code: HttpStatus.OK,
                data,
                message: "Note fetched successfully "
            };
        } else {
            // Note not found
            return {
                code: HttpStatus.NOT_FOUND,
                data: null,
                message: "Note not found for this user"
            };
        }

    } catch (error) {
        console.log(error);
        return {
            code: HttpStatus.BAD_GATEWAY,
            data: [],
            message: "unsuccessful"
        }
    }
}
export const getById = async (id) => {
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
        message: "Note deleted 😵"
    }
}
export const updateNote = async (notesData, id) => {
    try {
        // console.log("-->", id);
        const data = await Notes.update(notesData, { where: { id: id } });
        return {
            code: HttpStatus.OK,
            data: data,
            message: "Note updated"
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
export const isArchive = async (id) => {
    try {
        // console.log(">service-debug", id);
        const data = await Notes.findOne({ where: { id: id } });
        // console.log(">service-debug", data.isArchive);
        if (!data.isArchive) {
            data.isArchive = !data.isArchive;
            await data.save();
            // console.log(">service-debug", data.isArchive);
            return {
                code: HttpStatus.OK,
                data: [],
                message: "Note is Archived 🫡"
            }
        } else if (data.isArchive) {
            data.isArchive = !data.isArchive;
            await data.save();
            return {
                code: HttpStatus.OK,
                data: [],
                message: "Note is Archived 🫡"
            }
        } else {
            return {
                code: HttpStatus.BAD_GATEWAY,
                data: [],
                message: "Something went wrong..😵"
            }
        }
    } catch (error) {
        return {
            code: HttpStatus.BAD_GATEWAY,
            data: [],
            message: "Archive unsuccessful..!"
        }
    }
}
export const isTrash = async (id) => {
    try {
        const data = await Notes.findOne({ where: { id: id } });
        if (!data.isTrash) {
            data.isTrash = !data.isTrash;
            await data.save();
            return {
                code: HttpStatus.OK,
                data: [],
                message: "Note is Trashed 🫡"
            }
        } else if (data.isTrash) {
            data.isTrash = !data.isTrash;
            await data.save();
            return {
                code: HttpStatus.OK,
                data: [],
                message: "Note is Trashed 🫡"
            }
        } else {
            return {
                code: HttpStatus.BAD_GATEWAY,
                data: [],
                message: "Something went wrong..😵"
            }
        }
    } catch (error) {
        return {
            code: HttpStatus.BAD_GATEWAY,
            data: [],
            message: "Archive unsuccessful..!"
        }
    }
}
export const setColor = async (notesData, id) => {
    console.log(">debug service", notesData);
    const data = await Notes.update(notesData, { where: { id: id } });
    console.log(">debug service", data);

    return {
        code: HttpStatus.OK,
        data: [],
        message: `color is changed to ${notesData.color}`
    }
}