import prisma from '../utilities/dbClient'

async function createVisitDb({
	userId,
	locationName,
	logEntries = [],
	pictures = [],
}) {
	return await prisma.$transaction(async (prisma) => {
		let location = await prisma.location.findFirst({
			where: {
				name: locationName,
				createdById: userId,
			},
		})

		if (!location) {
			location = await prisma.location.create({
				data: {
					name: locationName,
					createdById: userId,
				},
			})
        }
        
		const visit = await prisma.visit.create({
			data: {
				userId,
				locationId: location.id,
			},
        })
        
		if (logEntries.length > 0) {
			await prisma.logEntry.createMany({
				data: logEntries.map((logText) => ({
					visitId: visit.id,
					logText,
				})),
			})
        }
        
		if (pictures.length > 0) {
			await prisma.picture.createMany({
				data: pictures.map((pictureUrl) => ({
					visitId: visit.id,
					pictureUrl,
				})),
			})
		}

		const newVisit = await prisma.visit.findUnique({
			where: {
				id: visit.id,
			},
			include: {
				location: {
					select: {
						id: true,
						name: true, 
					},
				},
				logEntries: {
					select: {
						logText: true,
					},
				},
				pictures: {
					select: {
						pictureUrl: true,
					},
				},
			},
		})

		return newVisit 
	})
}


export {
    createVisitDb
}