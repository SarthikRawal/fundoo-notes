import express from 'express';
const router = express.Router();

import userRoute from './user.route';
import notesRoute from './notes.route';
/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = () => {

  router.get('/', (req, res) => {
    res.json('Welcome sarthik..');
  });
  router.use('/users', userRoute);

  router.use('/notes', notesRoute);


  return router;
};

export default routes;
