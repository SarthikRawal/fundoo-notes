import { error } from '@hapi/joi/lib/base';
import sequelize, { DataTypes } from '../config/database';
const Notes = require('../models/notes')(sequelize, DataTypes);
import HttpStatus from 'http-status-codes';
import { catchAllNotes, deleteAllCachedNote } from '../utils/notes.util';
// import dotenv from 'dotenv';

export const createNote = async (notesData) => {
  try {
    const data = await Notes.create(notesData);
    await deleteAllCachedNote(notesData.userId);
    return {
      code: HttpStatus.OK,
      data: data,
      message: 'Notes created 🎉'
    };
  } catch (error) {
    console.log(error);
    return {
      code: HttpStatus.BAD_GATEWAY,
      data: [],
      message: 'Notes creation unsuccessful'
    };
  }
};
export const getAllNote = async (userId) => {
  try {
    // console.log('-->', userId);
    const data = await Notes.findAll({ where: { userId: userId } });
    // console.log('-->', data);
    await catchAllNotes(userId);
    if (data.length === 0) {
      // Note found
      return {
        code: HttpStatus.BAD_REQUEST,
        data: null,
        message: 'Note not found for this user..😵'
      };
    } else {
      // Note not found
      return {
        code: HttpStatus.OK,
        data,
        message: 'Note fetched successfully 🫡'
      };
    }
  } catch (error) {
    // console.log(error);
    return {
      code: HttpStatus.BAD_GATEWAY,
      data: [],
      message: error.message
    };
  }
};
export const getById = async (id, userId) => {
  try {
    const data = await Notes.findAll({ where: { id: id, userId: userId } });
    // console.log('data--', data);
    if (data.length === 0) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        data: [],
        message: 'Unauthorized user ☠️'
      };
    }
    return {
      code: HttpStatus.OK,
      data: data,
      message: 'data fetched 👍'
    };
  } catch (error) {
    // console.log('-->', error);
    return {
      code: HttpStatus.BAD_GATEWAY,
      data: [],
      message: 'unsuccessful'
    };
  }
};
export const deleteNote = async (id) => {
  // console.log('-->', id);
  await Notes.destroy({ where: { id: id } });
  return {
    code: HttpStatus.OK,
    message: 'Note deleted 😵'
  };
};
export const updateNote = async (notesData, id, userId) => {
  try {
    // console.log("-->", id);
    const data = await Notes.update(notesData, {
      where: { id: id, userId: userId }
    });
    if (data.length === 0) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized user ☠️'
      };
    }
    return {
      code: HttpStatus.OK,
      data: data,
      message: 'Note updated'
    };
  } catch (error) {
    // console.log('-->', error);
    return {
      code: HttpStatus.BAD_GATEWAY,
      data: [],
      message: 'unsuccessful'
    };
  }
};
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
        message: 'Note is Archived 🫡'
      };
    } else if (data.isArchive) {
      data.isArchive = !data.isArchive;
      await data.save();
      return {
        code: HttpStatus.OK,
        data: [],
        message: 'Note is Archived 🫡'
      };
    } else {
      return {
        code: HttpStatus.BAD_GATEWAY,
        data: [],
        message: 'Something went wrong..😵'
      };
    }
  } catch (error) {
    return {
      code: HttpStatus.BAD_GATEWAY,
      data: [],
      message: 'Archive unsuccessful..!'
    };
  }
};
export const isTrash = async (id) => {
  try {
    const data = await Notes.findOne({ where: { id: id } });
    if (!data.isTrash) {
      data.isTrash = !data.isTrash;
      await data.save();
      return {
        code: HttpStatus.OK,
        data: [],
        message: 'Note is Trashed 🫡'
      };
    } else if (data.isTrash) {
      data.isTrash = !data.isTrash;
      await data.save();
      return {
        code: HttpStatus.OK,
        data: [],
        message: 'Note is Trashed 🫡'
      };
    } else {
      return {
        code: HttpStatus.BAD_GATEWAY,
        data: [],
        message: 'Something went wrong..😵'
      };
    }
  } catch (error) {
    return {
      code: HttpStatus.BAD_GATEWAY,
      data: [],
      message: 'Archive unsuccessful..!'
    };
  }
};
export const setColor = async (notesData, id, userId) => {
  try {
    // console.log('>debug service - input notesData:', notesData);
    const data = await Notes.findAll({ where: { id: id, userId: userId } });
    // console.log('>debug service - retrieved data:', data);
    if (data.length === 0) {
      return {
        code: HttpStatus.UNAUTHORIZED,
        data: [],
        message: 'Unauthorized user ☠️'
      };
    }
    await Notes.update(notesData, { where: { id: id } });
    return {
      code: HttpStatus.OK,
      data: [],
      message: `color is changed to ${notesData.color}`
    };
  } catch (error) {
    // console.error('>debug service - error:', error);
    return {
      code: HttpStatus.UNAUTHORIZED,
      message: error.message
    };
  }
};
export const addCollab = async (notesData, id) => {
  try {
    // console.log("-->email", notesData);
    const note = await Notes.findByPk(id);
    // console.log('note--', note);
    if (!note) {
      return {
        code: HttpStatus.NOT_FOUND,
        note: [],
        message: 'Note not found'
      };
    }
    // console.log('befor push:', note.collabEmail);

    // note.collabEmail.push(notesData.collabEmail);
    const updatedCollabEmail = [...note.collabEmail, notesData.collabEmail];

    // console.log("->", note.collabEmail);

    await Notes.update(
      { collabEmail: updatedCollabEmail },
      { where: { id: id } }
    );
    const newNote = await Notes.findByPk(id);
    // console.log("---->", notesData);
    // await note.save();
    // console.log("new data:", note);
    return {
      code: HttpStatus.OK,
      note: newNote.collabEmail,
      message: 'New collaboration added '
    };
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
