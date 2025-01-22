import { User } from '../models/user.js'
import { Dissertation_request } from '../models/dissertation_request.js'
import { Op } from 'sequelize'

// get all dissertation requests
const getAllRequestsFromDB = async (req, res) => {
  try {
    //The findAll() method will return your table rows as an array of objects.
    //The Sequelize findAll() method is used to query data from your SQL table to your JavaScript application.
    const requests = await Dissertation_request.findAll()
    return res.status(200).json(requests)
  } catch (err) {
    res.status(500).json(err)
    //The HTTP status code 500 is a generic error response.
    //It means that the server encountered an unexpected condition
    //that prevented it from fulfilling the request.
  }
}


// the ID is the primary key => findByPk() sequelize method
const getRequestsFromDBById = async (req, res) => {
  try {
    const request = await Dissertation_request.findByPk(req.params.requestId) // find by primary key => findByPK()
    if (request) {
      return res.status(200).json(request)
    } else {
      // if no entity exists, null is returned;
      return res
        .status(404)
        .json({ error: `Dissertation_request with id ${req.params.requestId} not found` })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

//INSERT INTO
const insertRequestsIntoDB = async (req, res) => {
  try {
    //create is mapped by Sequelize to "INSERT INTO ..."
    const newRequest = await Dissertation_request.create(req.body)
    return res.status(200).json(newRequest)
  } catch (err) {
    return res.status(500).json(err)
  }
}

//UPDATE
const updateRequestsById = async (req, res) => {
  try {
    const request = await Dissertation_request.findByPk(req.params.requestId)
    if (request) {
      const updatedRequests = await request.update(req.body) // update using the update() method provided by Sequelize on the returned PK object
      // OBS: update on the found object and not on the "Users" model
      return res.status(200).json(updatedRequests)
    } else {
      // if no entity exists, null is returned;
      return res
        .status(404)
        .json({ error: `Request with id ${req.params.requestId} not found` })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

//DELETE
const deleteRequests = async (req, res) => {
  try {
    const request = await Dissertation_request.findByPk(req.params.requestId) // find by primary key => findByPK()
    if (request) {
      // destroy() is mapped to "DELETE ... FROM ..."
      await request.destroy()
      return res.status(200).json('Entity deleted successfully!')
      //OBS: destroy() the found user and do not call destroy() on the "Users" model
    } else {
      // if no entity exists, null is returned;
      return res
        .status(404)
        .json({ error: `Request with id ${req.params.requestId} not found` })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

//FILTER

const filterRequestsFromDB = async (req, res) => {
  try {
    const status = req.query.status;
    const teacherId = req.query.teacherId;
    const studentId = req.query.studentId;

    let whereClause = {};
    
    if (status) {

      // if type exists add condition in whereClause
      whereClause.status = status;
    }

    if (teacherId) {
      whereClause.teacher_id = teacherId;
    }

    if (studentId) {
      whereClause.student_id = studentId;
    }
    
    const requests = await Dissertation_request.findAll({
      
      where: whereClause
    })
    return res.status(200).json(requests)
  } catch (err) {
    res.status(500).json(err)
  }
}

const CheckExistingRequest = async (req, res) => {
  try {
    const teacherId = req.query.teacherId;
    const studentId = req.query.studentId;

    const existingRequest = await Dissertation_request.findOne({
      where: {
        teacher_id: teacherId,
        student_id: studentId,
      },
    });

    return res.status(200).json({ exists: existingRequest !== null });
  } catch (err) {
    res.status(500).json(err);
  }
};


export {
  getAllRequestsFromDB,
  getRequestsFromDBById,
  filterRequestsFromDB,
  insertRequestsIntoDB,
  updateRequestsById,
  deleteRequests,
  CheckExistingRequest
}