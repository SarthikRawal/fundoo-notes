// import HttpStatus from 'http-status-codes';
// import { response } from 'express';
import * as notesService from '../services/notes.service';

export const createNotes = async (req, res) => {
    const data = await notesService.createNote(req.body);

    res.status(data.code).json(data);

}
export const readAllNotes = async (req, res) => {
    const data = await notesService.readAllNote();

    res.status(data.code).json(data);

}
export const readById = async (req, res) => {
    const data = await notesService.readById(req.params.id);

    res.status(data.code).json(data);

}
export const deleteNote = async (req, res) => {
    const data = await notesService.deleteNote(req.params.id);

    res.status(data.code).json(data);

}
export const updateNote = async (req, res) => {
    const data = await notesService.updateNote(req.body, req.params.id);

    res.status(data.code).json(data);
}