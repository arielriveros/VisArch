type ID = string;

export interface UserApiResponse {
  _id: ID;
  userName: string;
  displayName: string;
  email: string;
  picture?: string;
}

export interface ProjectApiResponse {
  _id: ID;
  name: string;
  description: string;
  owner: {
    _id: ID;
    displayName: string;
    email: string;
  };
  collaborators: {
    _id: ID;
    displayName: string;
    email: string;
  }[];
  tasks: ID[]
}

export interface ProjectsApiResponse extends Array<ProjectApiResponse> {}

export interface Entity {
  id: ID;
  faces: number[];
  scale: number;
  orientation: number;
  reflection: boolean;
  addedBy: ID;
}

export interface Archetype {
  id: ID;
  label: string;
  entities: Entity[];
  archetype: string | null;
  color: string;
  addedBy: ID;
}

export interface TaskApiResponse {
  _id: ID;
  name: string;
  description: string;
  model: string;
  thumbnail: string;
  annotations: Archetype[];
  owner: UserApiResponse;
  collaborators: UserApiResponse[];
}

export interface TasksApiResponse extends Array<TaskApiResponse> {}