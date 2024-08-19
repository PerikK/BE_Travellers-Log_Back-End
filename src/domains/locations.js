import prisma from '../utilities/dbClient.js'

const createLocationDb = async (userId, name) => {
	const location = await getLocationByNameDB(name)

	const newLocation = await prisma.location.create({
        data: {
            createdById: userId,
			name: name,
		},
	})

	return newLocation
}

const getLocationsByUserDb = async (userId) => {
	const userLocations = await prisma.location.findMany({
		where: {
			visits: {
				some: {
					userId: userId,
				},
			},
		},
		select: {
			createdBy: true,
			name:true
		},
	})
	return userLocations
}

const getLocationByNameDB = async (name) => {
	const foundLocation = await prisma.location.findFirst({
		where: {
			name: name,
		},
		include: {
			visits: {
				include: {
					pictures: true,
					logEntries: true,
				},
			},
		},
	})
	return foundLocation
}

const getAllLocationsDb = async () => {
	const allLocations = await prisma.location.findMany()
	return allLocations
}

export {
	createLocationDb,
	getAllLocationsDb,
	getLocationsByUserDb,
	getLocationByNameDB,
}
