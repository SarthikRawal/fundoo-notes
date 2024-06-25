import express from 'express';
import * as notesController from '../controllers/notes.controller';

const router = express.Router();

// create notes
router.post('', notesController.createNotes);

// read notes
router.get('', notesController.readAllNotes);

// read notes by id
router.get('/:id', notesController.readById);

// read notes 
router.delete('/:id', notesController.deleteNote);

// update notes 
router.put('/:id', notesController.updateNote);

export default router;