import { getDatabase } from '@/lib/database.js'
import getUser from '@/lib/models/User.js'

let userSchemaReady = false

async function ensureUserSchema(User, sequelize) {
  if (userSchemaReady) return
  await User.sync()

  const queryInterface = sequelize.getQueryInterface()
  const table = await queryInterface.describeTable('users')
  const columnsToEnsure = ['specialization', 'bio']

  for (const column of columnsToEnsure) {
    if (!table[column] && User.rawAttributes[column]) {
      await queryInterface.addColumn('users', column, User.rawAttributes[column])
    }
  }

  userSchemaReady = true
}

export async function GET(request) {
  try {
    const sequelize = getDatabase()
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 })
    }
    
    await sequelize.authenticate()
    
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const id = searchParams.get('id')

    const User = getUser()
    if (!User) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 })
    }

    await ensureUserSchema(User, sequelize)
    const sanitizeUser = (user) => {
      const data = user?.toJSON ? user.toJSON() : user
      if (!data) return data
      const { password: _, ...safeUser } = data
      return safeUser
    }

    if (email) {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return Response.json({ error: 'User not found' }, { status: 404 })
      }
      return Response.json(sanitizeUser(user))
    }

    if (id) {
      const user = await User.findByPk(id)
      if (!user) {
        return Response.json({ error: 'User not found' }, { status: 404 })
      }
      return Response.json(sanitizeUser(user))
    }

    // Get all users (admin only - could add auth check)
    const users = await User.findAll()
    return Response.json(users.map(sanitizeUser))
  } catch (error) {
    console.error('[API] GET Users Error:', error)
    return Response.json({ error: error.message, debug: error.toString() }, { status: 500 })
  }
}
