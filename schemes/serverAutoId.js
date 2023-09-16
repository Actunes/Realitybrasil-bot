const mongoose = require("mongoose")

const scheme = new mongoose.Schema({
    _id: { type: String, required: true },
    idServer: { type: Array, default: false }
})

module.exports = mongoose.model("serverAutoId", scheme)