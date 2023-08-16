const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AnnotationSchema = new Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    nameId: {
        type: String,
        required: true
    },
    foldSymmetry: {
        type: Number,
        default: 0
    },
    /* 
        Annotation Entity has the following structure:
        {
            nameId: string;
            faceIds: number[];
            orientation: number;
            scale: number;
            reflection: boolean;
        }
    */
    entities: [{
        type: Object
    }]
});

const AnnotationModel = mongoose.model('Annotation', AnnotationSchema);

module.exports = AnnotationModel;