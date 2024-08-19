import prisma from '../utilities/dbClient.js'
import bcrypt from 'bcrypt'

const createUserDb = async (username, password) => {
	const hashedPassword = await bcrypt.hash(password, 8)
	const newUser = await prisma.user.create({
		data: {
			username: username,
			password: hashedPassword,
		},
		select: {
			id: true,
			username: true,
			createdAt: true,
			updatedAt: true,
		},
	})
	return newUser
}

const getUserByIdDb = async (id) => {
	const foundUser = await prisma.user.findUnique({
		where: {
			id: id,
		},
		include: {
            visits: {
                include: {
                    location: {
                        select: {name: true}
                }}
            },
		},
	})

	if (foundUser) {
		const { password, ...userWithoutPassword } = foundUser
		return userWithoutPassword
	}

	return null
}

const getUserByUsernameDb = async (username) => {
	const foundUser = await prisma.user.findUnique({
		where: {
			username: username,
		},
		include: {
			visits: {
                include: {
                    logEntries: true,
                    pictures: true,
					location: {
						select: {
							name: true
						},
					},
				},
			},
		},
	})
	return foundUser
}

const getAllUsersDb = async () => {
	const allUsers = await prisma.user.findMany()
	return allUsers
}

export {
	createUserDb,
	getUserByIdDb,
	getAllUsersDb,
	getUserByUsernameDb,
}
