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

  export type Task = {
	readonly _id: string,
	name: string,
	meshPath: string,
	status: 'active' | 'archived',
}