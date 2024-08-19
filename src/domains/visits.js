import prisma from '../utilities/dbClient.js'
import { createLocationDb, getLocationByNameDB } from './locations.js'

const createVisitDb = async (
	userId,
	locationName,
	logEntries = [],
	pictures = []
) => {
	let location = await getLocationByNameDB(locationName)

	if (!location) {
		location = await createLocationDb(userId, locationName)
	}

	const result = await prisma.$transaction(async (prisma) => {
		const newVisit = await prisma.visit.create({
			data: {
				user: {
					connect: { id: userId },
				},
				location: {
					connect: { id: location.id },
				},

				logEntries:
					logEntries.length > 0
						? {
								create: logEntries.map((entry) => ({
									logText: entry,
								})),
						  }
						: undefined,
				pictures:
					pictures.length > 0
						? {
								create: pictures.map((url) => ({
									pictureUrl: url,
								})),
						  }
						: undefined,
			},
			include: {
				location: {
					select: { name: true },
				},
				logEntries: true,
				pictures: true,
			},
		})

		return newVisit
	})

	return result
}

const getVisitsByUserDb = async (userId) => {
	const userVisits = await prisma.visit.findMany({
		where: {
			userId: userId,
		},
		include: {
			logEntries: true,
			pictures: true,
			location: {
				select: {
					name: true,
				},
			},
		},
	})
	return userVisits
}

const getVisitByIdDb = async (id) => {
	const foundVisit = await prisma.visit.findFirst({
		where: {
			id: id,
		},
	})
	return foundVisit
}

const existingVisitDb = async (userId, locationName) => {
	const existingVisit = await prisma.visit.findFirst({
		where: {
			userId: userId,
			location: {
				name: locationName,
			},
		},
	})
	return existingVisit
}

const updateVisitDb = async (
	userId,
	visitId,
	newLogEntries = [],
	newPictures = []
) => {
	console.log('updateVisitDb called with:', {
		userId,
		visitId,
		newLogEntries,
		newPictures,
	})

	const updateData = {}

	if (newLogEntries.length > 0) {
		updateData.logEntries = {
			create: newLogEntries.map((entry) => ({
				logText: entry,
			})),
		}
	}

	if (newPictures.length > 0) {
		updateData.pictures = {
			create: newPictures.map((url) => ({
				pictureUrl: url,
			})),
		}
	}

	const updatedVisit = await prisma.visit.update({
		where: { id: visitId },
		data: updateData,
		include: {
			logEntries: true,
			pictures: true,
		},
	})

	console.log('Updated visit:', updatedVisit)

	return updatedVisit
}

// const updateVisitDb = async (
// 	userId,
// 	id,
// 	newLogEntries,
// 	newPicturess
// ) => {
// 	const visitToUpdate = await prisma.visit.findUnique({
// 		where: { userId: userId, id: id },
// 		select: {
// 			userId: true,
// 			locationId: true,
// 			location: true,
// 			createdAt: true,
// 			updatedAt: true,
// 		},
// 	})

// 	const updateData = {}

// 	if (newLogEntries) {
// 		console.log(newLogEntries)
// 		console.log(newLogEntries[1])
// 		const log = await prisma.logEntry.findFirst({
// 			where: {
// 				visitId: id,
// 			},
// 			select: {
// 				id: true,
// 				logText: true,
// 			},
// 		})

// 		let logUpdateData
// 		if (log) {
// 			logUpdateData = {
// 				update: {
// 					where: { id: log.id },
// 					data: {
// 						logText: {
// 							set: [...log.logEntry, logEntry],
// 						},
// 					},
// 				},
// 			}
// 		} else {
// 			logUpdateData = {
// 				create: {
// 					visitId: id,
// 					logEntries: [logEntry],
// 					userId: visitToUpdate.userId,
// 					locationId: visitToUpdate.locationId,
// 				},
// 			}
// 		}
// 		updateData.logEntries = logUpdateData
// 	}

// 	if (pictureUrl) {
// 		updateData.pictures = {
// 			create: {
// 				pictureUrl: [pictureUrl],
// 				userId: visitToUpdate.userId,
// 				locationId: visitToUpdate.locationId,
// 			},
// 		}
// 	}

// 	const updatedVisit = await prisma.visit.update({
// 		where: {
// 			id: id,
// 		},
// 		data: updateData,
// 		include: {
// 			log: true,
// 			pictures: true,
// 		},
// 	})
// 	return updatedVisit
// }

export {
	createVisitDb,
	getVisitByIdDb,
	existingVisitDb,
	getVisitsByUserDb,
	updateVisitDb,
}
