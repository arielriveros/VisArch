import { Schema } from "mongoose";

export interface IEntity extends Document {
  id: string;
  faces: number[];
  scale: number;
  orientation: number;
  reflection: boolean;
  addedBy: string;
}

const EntitySchema = new Schema<IEntity>({
  id: {
    type: String,
    required: true,
  },
  addedBy: {
    type: String,
    required: true,
  },
  faces: {
    type: [Number],
    required: true,
  },
  scale: {
    type: Number,
    required: false,
    default: 1,
  },
  orientation: {
    type: Number,
    required: false,
    default: 0,
  },
  reflection: {
    type: Boolean,
    required: false,
    default: false,
  },
}, {
  _id: false
});

export interface IAnnotation extends Document {
  id: string;
  archetype: string | null;
  label: string;
  entities: IEntity[];
  color: string;
  addedBy: string;
}

export const AnnotationSchema = new Schema<IAnnotation>({
  id: {
    type: String,
    required: true,
  },
  archetype: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
  },
  entities: [EntitySchema],
  color: {
    type: String,
    required: false,
    default: '#000000',
  },
  addedBy: {
    type: String,
    required: true
  }
}, {
  _id: false
});