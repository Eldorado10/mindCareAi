// Shared in-memory user store (replace with database in production)
let users = []
let userId = 1

export function getUsers() {
  return users
}

export function addUser(user) {
  users.push(user)
  return user
}

export function findUserByEmail(email) {
  return users.find(u => u.email === email)
}

export function getNextUserId() {
  return userId++
}

export function resetUsers() {
  users = []
  userId = 1
}
