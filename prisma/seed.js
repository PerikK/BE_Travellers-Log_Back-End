import prisma from '../src/utilities/dbClient.js'
import bcrypt from 'bcrypt'

async function seed() {
    await prisma.location.deleteMany()
    await prisma.picture.deleteMany()
    await prisma.user.deleteMany()
    await prisma.visit.deleteMany()
    await prisma.logEntry.deleteMany()
	const hashedPassword = await bcrypt.hash('111', 8)
	for (let i = 1; i <= 5; i++) {
		const user = await prisma.user.create({
			data: {
				username: `user${i}`,
				password: hashedPassword,
			},
		})

		for (let j = 1; j <= 2; j++) {
			const location = await prisma.location.create({
				data: {
					name: `Location${i}${j}`,
					createdById: user.id,
				},
			})

			const visit = await prisma.visit.create({
				data: {
					userId: user.id,
					locationId: location.id,
				},
			})

			await prisma.logEntry.createMany({
				data: [
					{
						visitId: visit.id,
						logText: `Log entry 1 for visit ${j} of User${i}`,
					},
					{
						visitId: visit.id,
						logText: `Log entry 2 for visit ${j} of User${i}`,
					},
				],
			})

			await prisma.picture.createMany({
				data: [
					{
						visitId: visit.id,
						pictureUrl: `https://example.com/user${i}-visit${j}-pic1.jpg`,
					},
					{
						visitId: visit.id,
						pictureUrl: `https://example.com/user${i}-visit${j}-pic2.jpg`,
					},
				],
			})
		}
	}

	for (let i = 6; i <= 7; i++) {
		const user = await prisma.user.create({
			data: {
				username: `user${i}`,
				password: hashedPassword,
			},
		})

		for (let j = 1; j <= 2; j++) {
			const location = await prisma.location.create({
				data: {
					name: `Location${i}${j}`,
					createdById: user.id,
				},
			})

			await prisma.visit.create({
				data: {
					userId: user.id,
					locationId: location.id,
				},
			})
		}
	}
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
