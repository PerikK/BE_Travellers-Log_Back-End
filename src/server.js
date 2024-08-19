import express from 'express'
import 'express-async-errors'
import {
	MissingFieldsError,
	DataNotFoundError,
	ExistingDataError,
	InvalidCredentialsError,
} from './errors/errors.js'
import 'dotenv/config'
import cors from 'cors'
import userRouter from './routers/users.js'
// import locationRouter from './routers/locations.js'
import visitRouter from './routers/visits.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/users', userRouter)
// app.use('/locations', locationRouter)
app.use('/visits', visitRouter)

app.use((error, req, res, next) => {
	if (error instanceof MissingFieldsError) {
		return res.status(400).json({ error: error.message })
	}
	if (error instanceof InvalidCredentialsError) {
		return res.status(401).json({ error: error.message })
	}
	if (error instanceof DataNotFoundError) {
		return res.status(404).json({ error: error.message })
	}
	if (error instanceof ExistingDataError) {
		return res.status(409).json({ error: error.message })
	}

	console.error(error)
	res.status(500).json({
		message: 'Something went wrong',
	})
})

export default app
