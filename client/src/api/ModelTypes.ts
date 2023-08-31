export type User = {
    readonly _id: string;  
    username: string;
    email: string;
    token: string;
}

export type Project = {
    readonly _id: string;
    name: string;
    description?: string;
    tasks: {
        readonly _id: string
    }[];
    members: {
        readonly _id: string;
        username: string;
    }[];
    owner: {
        readonly _id: string;
        username: string;
    };
    status: 'active' | 'archived';
}

export type PatternEntity = {
    nameId: string;
    faceIds: number[];
    orientation: number;
    scale: number;
    reflection: boolean;
    centroid: {x: number, y: number, z: number};
    box: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}};
}

export type PatternArchetype = {
    nameId: string;
    fold_symmetry: number;
    entities: PatternEntity[];
    color: string;
}

export type Task = {
    readonly _id: string,
	name: string,
	meshPath: string,
	status: 'active' | 'archived',
    annotations: PatternArchetype[],
}