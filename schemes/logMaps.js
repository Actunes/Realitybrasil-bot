const mongoose = require("mongoose")

const mapaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    vezesRodado: { type: Number, default: 0 },
    ultimaVezRodado: { type: Date, default: null }
})

const mapaCollectionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    mapas: [mapaSchema]
})

module.exports = mongoose.model("logMaps", mapaCollectionSchema)