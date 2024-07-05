import express from 'express';
import * as notesController from '../controllers/notes.controller';
import { userAuth } from '../middlewares/auth.middleware';
import { getAllCatchedNotes } from '../utils/notes.util';

const router = express.Router();

// create notes
router.post('', userAuth, notesController.createNotes);

// read notes
router.get('/getAllNote', userAuth, getAllCatchedNotes, notesController.getAllNotes);

// read notes by id
router.get('/getById/:id', userAuth, notesController.getById);

// read notes
router.delete('/delete/:id', userAuth, notesController.deleteNote);

// update notes
router.put('/update/:id', userAuth, notesController.updateNote);

// isArchive
router.put('/isArchive/:id', userAuth, notesController.isArchive);

// isTrash
router.put('/isTrash/:id', userAuth, notesController.isTrash);

// set note color
router.put('/setColor/:id', userAuth, notesController.setColor);

// add collaboration on a note
router.put('/addCollab/:id', userAuth, notesController.addCollab);

export default router;
