import express from 'express'
import { User } from '../models/user.js'
import { Dissertation_request } from '../models/dissertation_request.js'

const userRouter = express.Router()

/**
 * GET all the users from the database.
 */
userRouter.get('/allUsers1', async (request, response, next) => {
  try {
    const users = await User.findAll()
    if (users.length > 0) {
      response.json(users)
    } else {
      response.sendStatus(204)
    }
  } catch (error) {
    next(error) 
  }
})

/**
 * POST a new user to the database.
 */
userRouter.post('/addNewUser1', async (request, response, next) => {
  try {
    const user = await User.create(request.body)
    response.status(201).send()
  } catch (error) {
    next(error) // use the next optional parameter
    // to pass control to the next middleware function if defined (it is, in app.js)
  }
})

/**
 * GET a specific user's dissertation_requests.
 */
userRouter.get(
  '/:userId/dissertation_requests1',
  async (request, response, next) => {
    try {
      const user = await User.findByPk(request.params.userId)
      if (user) {
        const dissertation_requests = await user.getDissertation_requests() // sequelize names the method using 'get' + *uppercase modelName* (plural form)
        if (dissertation_requests.length > 0) {
          response.json(dissertation_requests)
        } else {
          response.sendStatus(204)
        }
      } else {
        response.sendStatus(404)
      }
    } catch (error) {
      next(error)
    }
  }
)

/**
 * POST a new dissertation_request into a user.
 */
userRouter.post(
  '/:userId/dissertation_requests1',
  async (request, response, next) => {
    try {
      const user = await User.findByPk(request.params.userId)
      if (user) {
        const dissertation_request = await Dissertation_request.create(request.body)
        user.addDissertation_request(dissertation_request) // sequelize names the method using 'add' + *uppercase modelName*
        await user.save() //If you want to update a specific set of fields, you can use update(),
        //otherwise save() will also persist any other changes that have been made on this instance
        response.status(201).location(dissertation_request.id).send()
      } else {
        // if the user does not exist (null is returned)
        // send the 404-Not Found
        response.sendStatus(404)
      }
    } catch (error) {
      next(error)
    }
  }
)

/**
 * GET a dissertation_request by id from a user by id.
 */
userRouter.get(
  '/:userId/dissertation_requests/:dissertation_requestId1',
  async (request, response, next) => {
    try {
      const user = await User.findByPk(request.params.userId)
      if (user) {
        const dissertation_requests = await user.getDissertation_requests({
          where: { id: request.params.dissertation_requestId } // could be searched by firstName or any attribute
        })
        // shift() js method => access the first element if an array of more results is returned
        const dissertation_request = dissertation_requests.shift()
        if (dissertation_request) {
          response.json(dissertation_request)
        } else {
          response.sendStatus(404)
        }
      } else {
        response.sendStatus(404)
      }
    } catch (error) {
      next(error)
    }
  }
)

/**
 * PUT to update a dissertation_request from a user.
 * Send data in the body of the request
 */
userRouter.put(
  '/:userId/dissertation_requests/:dissertation_requestId1',
  async (request, response, next) => {
    try {
      const user = await User.findByPk(request.params.userId)
      if (user) {
        const dissertation_requests = await user.getDissertation_requests({
          where: { id: request.params.dissertation_requestId }
        })
        const dissertation_request = dissertation_requests.shift()
        if (dissertation_request) {
          await dissertation_request.update(request.body) // update only if the dissertation_request exists
          response.sendStatus(204)
        } else {
          response.sendStatus(404)
        }
      } else {
        response.sendStatus(404)
      }
    } catch (error) {
      next(error)
    }
  }
)

/**
 * DELETE a dissertation_request from a user.
 */
userRouter.delete(
  '/:userId/dissertation_requests/:dissertation_requestId1',
  async (request, response, next) => {
    try {
      const user = await User.findByPk(request.params.userId)
      if (user) {
        const dissertation_requests = await user.getDissertation_requests({
          where: { id: request.params.dissertation_requestId } //where clause for filtering
        })
        const dissertation_request = dissertation_requests.shift()
        if (dissertation_request) {
          await dissertation_request.destroy()
          response.sendStatus(204)
        } else {
          response.sendStatus(404)
        }
      } else {
        response.sendStatus(404)
      }
    } catch (error) {
      next(error)
    }
  }
)

/**
 * GET the list of dissertation_request from a user
 */
userRouter.get(
  '/:userId/dissertation_requests1',
  async (request, response, next) => {
    try {
      const user = await User.findByPk(request.params.userId)
      if (user) {
        const dissertation_request = await user.getDissertation_requests()
        if (dissertation_request.length > 0) {
          response.json(dissertation_request)
        } else {
          response.sendStatus(204)
        }
      } else {
        response.sendStatus(404)
      }
    } catch (error) {
      next(error)
    }
  }
)

export { userRouter }