const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatternArchetypeSchema = new Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    foldSymmetry: {
        type: Number,
        default: 0
    },
    entities: [{
        type: Schema.Types.ObjectId,
        ref: 'PatternEntity'
    }]
});

PatternArchetypeSchema.pre('deleteOne', async function(next) {
    const archetype = await this.model.findOne(this.getQuery());
    if(!archetype)
        return next();

    const entities = await archetype.entities;
    if(!entities)
        return next();

    for(let entity of entities)
        await entity.deleteOne();

    return next();
});

const PatternArchetypeModel = mongoose.model('PatternArchetype', PatternArchetypeSchema);

module.exports = PatternArchetypeModel;