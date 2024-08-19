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
	console.log('RUN GET')
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

export {
	createVisitDb,
	getVisitByIdDb,
	existingVisitDb,
	getVisitsByUserDb,
}
