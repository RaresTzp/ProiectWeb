import { Session } from '../models/session.js';


// Crearea a unei sesiuni
//INSERT INTO
const createSession = async (req, res) => {
    try {
      //create is mapped by Sequelize to "INSERT INTO ..."
      const newSession = await Session.create(req.body)
      return res.status(200).json(newSession)
    } catch (err) {
      return res.status(500).json(err)
    }
}

// get all sessions
const getAllSessionsFromDB = async (req, res) => {
    try {
      //The findAll() method will return your table rows as an array of objects.
      //The Sequelize findAll() method is used to query data from your SQL table to your JavaScript application.
      const sessions = await Session.findAll()
      return res.status(200).json(sessions)
    } catch (err) {
      res.status(500).json(err)
      //The HTTP status code 500 is a generic error response.
      //It means that the server encountered an unexpected condition
      //that prevented it from fulfilling the request.
    }
}  

// the ID is the primary key => findByPk() sequelize method
const getSessionsFromDBById = async (req, res) => {
    try {
      const session = await Session.findByPk(req.params.sessionId) // find by primary key => findByPK()
      if (session) {
        return res.status(200).json(session)
      } else {
        // if no entity exists, null is returned;
        return res
          .status(404)
          .json({ error: `Session with id ${req.params.sessionId} not found` })
      }
    } catch (err) {
      res.status(500).json(err)
    }
}

//UPDATE
const updateSessionsById = async (req, res) => {
    try {
      const session = await Session.findByPk(req.params.sessionId)
      if (session) {
        const updatedSessions = await session.update(req.body) // update using the update() method provided by Sequelize on the returned PK object
        // OBS: update on the found object and not on the "Sessions" model
        return res.status(200).json(updatedSessions)
      } else {
        // if no entity exists, null is returned;
        return res
          .status(404)
          .json({ error: `Session with id ${req.params.sessionId} not found` })
      }
    } catch (err) {
      res.status(500).json(err)
    }
}
  
//DELETE
const deleteSessions = async (req, res) => {
    try {
      const session = await Session.findByPk(req.params.sessionId) // find by primary key => findByPK()
      if (session) {
        // destroy() is mapped to "DELETE ... FROM ..."
        await session.destroy()
        return res.status(200).json('Entity deleted successfully!')
        //OBS: destroy() the found session and do not call destroy() on the "Sessions" model
      } else {
        // if no entity exists, null is returned;
        return res
          .status(404)
          .json({ error: `Session with id ${req.params.sessionId} not found` })
      }
    } catch (err) {
      res.status(500).json(err)
    }
}
  
//FILTER
const filteSessionsFromDB = async (req, res) => {
    try {
      const teacher_id = req.query.teacher_id;
      let whereClause = {};
      
      if (teacher_id) {
        // Dacă există id ul specificat, adaugă condiția în whereClause
        whereClause.teacher_id = teacher_id;
      }
      
      const sessions = await Session.findAll({
        
        where: whereClause
      })
      return res.status(200).json(sessions)
    } catch (err) {
      res.status(500).json(err)
    }
}


export {
createSession,
getAllSessionsFromDB,
getSessionsFromDBById,
updateSessionsById,
filteSessionsFromDB,
deleteSessions
}
