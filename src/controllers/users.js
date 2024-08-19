import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
	createUserDb,
	getUserByUsernameDb,
	getAllUsersDb,
} from '../domains/users.js'
import {
	MissingFieldsError,
	ExistingDataError,
	DataNotFoundError,
	IncorrectFieldTypeError,
	InvalidCredentialsError,
} from '../errors/errors.js'

const createUser = async (req, res) => {
	const { username, password } = req.body

	if (!password || !username) {
		throw new MissingFieldsError(
			'Both username and password must be provided in order to create an account'
		)
	}
	const existingUser = await getUserByUsernameDb(username)
	if (existingUser) {
		throw new ExistingDataError('This username already exists')
	}

	const newUser = await createUserDb(username, password)
	res.status(201).json({ created: newUser })
}

const getUserById = async (req, res) => {
	const id = Number(req.params.id)

	if (!id) {
		throw new MissingFieldsError(
			'ID must be provided in order to search for a user by ID'
		)
	}

	const foundUser = await getUserByIdDb(id)
	if (!foundUser) {
		throw new DataNotFoundError(
			'There is no user with the specified ID'
		)
	}

	res.status(200).json({ user: foundUser })
}

const logInUser = async (req, res) => {
	const { username, password } = req.body

	if (!username || !password) {
		throw new MissingFieldsError(
			'Username AND password must be provided in order to login'
		)
	}

	const existingUser = await getUserByUsernameDb(username)
	if (!existingUser) {
		throw new DataNotFoundError(
			'The provided username does not exist'
		)
	}

	const validPass = await bcrypt.compare(
		password,
		existingUser.password
	)

	if (!validPass) {
		throw new InvalidCredentialsError(
			'Invalid Username OR Password. Access Denied!!!'
		)
	}

	const payload = {
		username: existingUser.username,
		id: existingUser.id,
	}
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '30d',
	})
	res.status(200).json({ token })
}

export { createUser, getUserById, logInUser }
