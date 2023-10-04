// import express, { Request, Response } from 'express';
// // import { promises as fs } from 'fs';
// import multer from 'multer';
// import path from 'path';

// const dirnameAbs = path.resolve();
// const imagesDirPath = path.join( dirnameAbs, '/static/_assets/images/users');

// const upload = multer({
//   limits: { fieldSize: 10 * 1024 * 1024 },
//   storage: multer.diskStorage({
//     filename: function (req, file, callback) {
//       callback(null, file.originalname);
//     },
//     destination: function (req, file, callback) {
//       callback(null, imagesDirPath);
//     },
//   }),
// });

// const router = express.Router();

// router.post(
//   '/',
//   upload.single('image'),
//   async (req: Request, res: Response) => {
//     res.send('successeded');
//   },
// );

// export default router;
