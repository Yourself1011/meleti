const Database = require("@replit/database")
const db = new Database()

module.exports = {
    db: db,
    async newUser(userID) {
        await db.set(userID, {
            id: userID,
            points: 0,
            tasks: []
        })
    }
}