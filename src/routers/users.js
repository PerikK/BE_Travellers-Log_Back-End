import { Router } from 'express'
import {
	createUser,
	getUserById,
	logInUser,
} from '../controllers/users.js'

const userRouter = Router()

userRouter.get('/:id', getUserById)
userRouter.post('/', createUser)
userRouter.post('/login', logInUser)

export default userRouter
