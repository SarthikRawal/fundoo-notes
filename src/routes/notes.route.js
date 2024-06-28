import express from 'express';
import * as notesController from '../controllers/notes.controller';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();

// create notes
router.post('', userAuth, notesController.createNotes);

// read notes
router.get('', userAuth, notesController.getAllNotes);

// read notes by id
router.get('/:id', userAuth, notesController.getById);

// read notes 
router.delete('/:id', userAuth, notesController.deleteNote);

// update notes 
router.put('/:id', userAuth, notesController.updateNote);

// isArchive 
router.put('/isArchive/:id', userAuth, notesController.isArchive);

// isTrash 
router.put('/isTrash/:id', userAuth, notesController.isTrash);

// set note color 
router.put('/setColor/:id', userAuth, notesController.setColor);

// add collaboration on a note 
router.put('/addCollab/:id', userAuth, notesController.addCollab);

export default router;