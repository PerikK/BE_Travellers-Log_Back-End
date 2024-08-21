import { getLocationByNameDB, getLocationsByUserDb } from '../domains/locations.js'
import { getUserByIdDb } from '../domains/users.js'
import {
	existingVisitDb,
	getVisitsByUserDb,
	createVisitDb,
	updateVisitDb,
	getVisitByIdDb,
} from '../domains/visits.js'
import {
	MissingFieldsError,
	ExistingDataError,
	DataNotFoundError,
	IncorrectFieldTypeError,
	InvalidCredentialsError,
} from '../errors/errors.js'

const createVisit = async (req, res) => {
	const { userId, locationName, logEntries, pictures } = req.body

	if (!userId || !locationName) {
		throw new MissingFieldsError(
			'User and location name must be provided in order to add a new visit'
		)
	}
	const user = await getUserByIdDb(Number(userId))
	if (!user) {
		throw new DataNotFoundError(
			'There is no user with the specified ID'
		)
	}
	const location = await getLocationByNameDB(locationName)
	if (location) {
		const existingVisit = await existingVisitDb(user.id, locationName)
		if (existingVisit) {
			throw new ExistingDataError(
				'This location already exists in your Travel Log. Maybe you want to update it?'
			)
		}
	}
	const newVisit = await createVisitDb(
		userId,
		locationName,
		logEntries,
		pictures
	)
	res.status(201).json({ visit_created: newVisit })
}

const getVisitsByUser = async (req, res) => {
	const userId = Number(req.params.id)
	const userVisits = await getVisitsByUserDb(userId)

	res.status(200).json({ user_visits: userVisits })
}

const updateVisit = async (req, res) => {
	const userId = Number(req.params.id)
    const { id, newLogEntries, newPictures } = req.body

	if (!newLogEntries && !newPictures) {
		throw new MissingFieldsError(
			'You must provide a log entry or a picture or both in order to update your visit'
		)
    }
    
    const existingVisit = await getVisitByIdDb(id)
    if (!existingVisit) {
        throw new DataNotFoundError('There is no visit with this id')
    }

    const updatedVisit = await updateVisitDb(
        userId,
		id,
		newLogEntries,
		newPictures
	)
	res.status(200).json({ updated_visit: updatedVisit })
}

export { createVisit, getVisitsByUser, updateVisit }
