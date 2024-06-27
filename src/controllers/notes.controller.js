// import HttpStatus from 'http-status-codes';
// import { response } from 'express';
import * as notesService from '../services/notes.service';

export const createNotes = async (req, res) => {
    // console.log("-->", req);
    const data = await notesService.createNote(req.body);

    res.status(data.code).json(data);

}
export const getAllNotes = async (req, res) => {
    const data = await notesService.getAllNote(req.body.userId);

    res.status(data.code).json(data);

}
export const getById = async (req, res) => {
    const data = await notesService.getById(req.params.id);

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
export const isArchive = async (req, res) => {
    const data = await notesService.isArchive(req.params.id);
    console.log(">debug", data);
    res.status(data.code).json(data);
}
export const isTrash = async (req, res) => {
    const data = await notesService.isTrash(req.params.id);
    res.status(data.code).json(data);
}