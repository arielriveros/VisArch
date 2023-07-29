# Visarch
Web application for the visualization and labeling of repetitive patterns in 3D meshes' surface.

## Installation
### API

#### Dependencies
* Node.js
* MongoDB (local or cloud)
  
#### Setup API for Development
On `api` directory run:
```
npm install
```

Create a .env file in the api folder and add the following variables:
```
PORT= <your port>
MONGO_URI= <your mongodb uri>
JWT_SECRET = <your jwt secret>
```

### Client

#### Dependencies
* Node.js

#### Setup Client for Development
On client directory run
```
npm start
```

## Development
On both api and client directories run: 
```
npm start
```

## Test
### API
On `api` directory run
```
npm start
```