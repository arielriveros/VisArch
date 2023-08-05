const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatternEntitySchema = new Schema({
    archetype: {
        type: Schema.Types.ObjectId,
        ref: 'PatternArchetype'
    },
    faceIds: [{
        type: Number
    }],
    orientation: {
        type: Number,
        default: 0
    },
    scale: {
        type: Number,
        default: 1
    },
    reflection: {
        type: Boolean,
        default: false
    }
});

const PatternEntityModel = mongoose.model('PatternEntity', PatternEntitySchema);

module.exports = PatternEntityModel;