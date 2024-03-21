type ID = string;

export interface UserApiResponse {
  _id: ID;
  name: string;
  email: string;
  picture?: string;
}

export interface ProjectApiResponse {
  _id: ID;
  name: string;
  description: string;
  owner: {
    _id: ID;
    name: string;
    email: string;
  };
  collaborators: {
    _id: ID;
    name: string;
    email: string;
  }[];
  tasks: ID[]
}

export interface ProjectsApiResponse extends Array<ProjectApiResponse> {}

export interface Entity {
  id: string;
  faces: number[];
  scale: number;
  orientation: number;
  reflection: boolean;
}

export interface Archetype {
  id: string;
  label: string;
  entities: Entity[];
  archetype: string | null;
  color: string;
}

export interface TaskApiResponse {
  _id: ID;
  name: string;
  description: string;
  model: string;
  annotations: Archetype[];
}

export interface TasksApiResponse extends Array<TaskApiResponse> {}