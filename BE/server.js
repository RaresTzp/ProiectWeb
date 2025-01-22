import express from 'express'
import cors from 'cors'
import { sequelize } from './sequelize.js'
import { mainRouter } from './Routes/mainRouter.js'

import { User } from './models/user.js'
import { Dissertation_request } from './models/dissertation_request.js'
import { Session } from './models/session.js'


const app = express()

// Define entities relationship
User.hasMany(Dissertation_request, { as: 'teacherRequests', foreignKey: 'teacher_id'});
User.hasMany(Dissertation_request, { as: 'studentRequests', foreignKey: 'student_id'});
User.hasMany(Session, { as: 'teacherSessions', foreignKey: 'teacher_id'});
Session.hasMany(Dissertation_request, { as: 'sessionDissertation', foreignKey: 'session_id'});

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())
app.use('/api', mainRouter)

// Create a middleware to handle errors (it will be accessed from the routers through next())
app.use((error, request, response, next) => {
    console.error(`[ERROR]: ${error}`)
    response.status(500).json(error)
  })


app.listen(5002, async () => {
    console.log('Express web server running on port 5002')
    try {
      await sequelize.authenticate()
      console.log('Connection has been established!')
    } catch (err) {
      console.error('Unable to connect to the database!', err)
    }
}) 