import express from "express";
import { sequelize } from "../sequelize.js";
import { userRouter } from "./userRouter.js";
import * as usersController from "../Controllers/usersController.js";
import * as sessionController from "../Controllers/sessionController.js";
import { User } from '../models/user.js'
import { Dissertation_request } from '../models/dissertation_request.js'
import * as dissertationRequestController from "../Controllers/dissertationRequestController.js";
import { Session } from '../models/session.js';
import multer from "multer";
import path from 'path';



const router = express.Router();

router.get("/users", usersController.getAllUsersFromDB);
router.get("/users/name", usersController.getAllUsersNamesFromDB);
router.get("/filterUsers", usersController.filterUsersFromDB);
router.post("/newUser", usersController.insertUsersIntoDB);
router.get("/users/:usersId", usersController.getUsersFromDBById);
router.put("/users/:userId", usersController.updateUsersById); // update is associated to the HTTP PUT method
router.delete("/users/:usersId", usersController.deleteUsers); // delete is associated to the HTTP DELETE method

router.get("/dissertation_requests", dissertationRequestController.getAllRequestsFromDB);
router.get("/filterRequests", dissertationRequestController.filterRequestsFromDB);
router.post("/newRequest", dissertationRequestController.insertRequestsIntoDB);
router.get("/dissertation_requests/:requestId", dissertationRequestController.getRequestsFromDBById);
router.put("/dissertation_requests/:requestId", dissertationRequestController.updateRequestsById); // update is associated to the HTTP PUT method
router.delete("/dissertation_requests/:requestId", dissertationRequestController.deleteRequests); // delete is associated to the HTTP DELETE method
router.get("/checkExistingRequest", dissertationRequestController.CheckExistingRequest);

router.post("/NewSession", sessionController.createSession);
router.get("/sessions", sessionController.getAllSessionsFromDB);
router.get("/filterSessions", sessionController.filteSessionsFromDB);
router.get("/sessions/:sessionsId", sessionController.getSessionsFromDBById);
router.put("/sessions/:sessionsId", sessionController.updateSessionsById); // update is associated to the HTTP PUT method
router.delete("/sessions/:sessionsId", sessionController.deleteSessions); // delete is associated to the HTTP DELETE method

// Login route
router.post('/login', usersController.loginUser);


// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Handle file upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    console.log('File uploaded:', req.file);
    res.send('File uploaded!');
  } else {
    console.error('Error uploading file:', req.fileValidationError);
    res.status(400).send('Error uploading file');
  }
});

export { router as mainRouter };
