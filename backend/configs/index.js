const app = require("configs/app")
const database = require("configs/database")
const hashing = require("configs/hashing")
const jwt = require("configs/jwt")
const cloudinary = require("configs/cloudinary")

const config = {
    app,
    database,
    jwt,
    hashing,
    cloudinary
}

module.exports = { config }