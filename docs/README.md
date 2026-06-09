# VisArch

VisArch is a web application for collaborative image annotation. It is composed of four
services orchestrated with Docker Compose:

| Service     | Tech                | Port (dev) | Description                                  |
| ----------- | ------------------- | ---------- | -------------------------------------------- |
| `client`    | React + Nginx       | `3000`     | Frontend, also reverse-proxies `/api` & `/websocket` |
| `api`       | Node/Express + Mongoose | `5000` | REST API and OAuth authentication            |
| `websocket` | Node                | `5001`     | Realtime collaboration channel               |
| `db`        | MongoDB 4.0         | `27018`    | Database (host port `27018` → container `27017`) |

## 1. Requirements

### Docker

Install **Docker** and **Docker Compose** (Compose v2 ships with Docker Desktop):

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS), or
- [Docker Engine + Compose plugin](https://docs.docker.com/engine/install/) (Linux)

Verify the install:

```bash
docker --version
docker compose version
```

### `.env` file

Create a file named `.env` in the project root. It must define the following variables:

```dotenv
# OAuth credentials
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Session / token signing secret
JWT_SECRET=your-random-secret

# Production only — public domain (no protocol), e.g. visarch.example.com
APP_URL=
```

> The `.env` file holds secrets and is git-ignored. Never commit it.

#### How to obtain each value

**`JWT_SECRET`** — any long random string used to sign sessions/tokens. Generate one with:

```bash
# Linux / macOS
openssl rand -hex 32

# Windows (PowerShell)
[Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Max 256 }))
```

**`GOOGLE_ID` / `GOOGLE_SECRET`** — from a Google OAuth client:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create (or select) a project.
3. Open **APIs & Services → OAuth consent screen**, configure it (User type *External*),
   and add your email as a test user.
4. Open **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
5. Application type: **Web application**.
6. Under **Authorized redirect URIs** add:
   - Development: `http://localhost:5000/api/auth/callback/google`
   - Production: `https://YOUR_DOMAIN/api/auth/callback/google`
7. Click **Create**. Copy the **Client ID** → `GOOGLE_ID` and **Client secret** → `GOOGLE_SECRET`.

**`GITHUB_ID` / `GITHUB_SECRET`** — from a GitHub OAuth app:

1. Go to GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   ([direct link](https://github.com/settings/developers)).
2. **Homepage URL**: `http://localhost:3000` (dev) or `https://YOUR_DOMAIN` (prod).
3. **Authorization callback URL**:
   - Development: `http://localhost:5000/api/auth/callback/github`
   - Production: `https://YOUR_DOMAIN/api/auth/callback/github`
4. Click **Register application**. Copy the **Client ID** → `GITHUB_ID`.
5. Click **Generate a new client secret** and copy it → `GITHUB_SECRET`.

## 2. Building with Docker (development)

From the project root, build all service images defined in `docker-compose.yml`:

```bash
docker compose build
```

This builds `client`, `api`, and `websocket` from their respective `Dockerfile`s.
The `db` service uses the official `mongo:4.0-xenial` image and needs no build.

## 3. Running the containers (development)

Start everything (add `-d` to run detached):

```bash
docker compose up
```

Once the stack is up:

- App: <http://localhost:3000>
- API: <http://localhost:5000/api>
- WebSocket: <http://localhost:5001>
- MongoDB: `localhost:27018`

The `api` connects to Mongo through the Compose network via `MONGO_URI=mongodb://db/visarch`.

Useful commands:

```bash
docker compose logs -f api      # follow logs for a service
docker compose down             # stop and remove containers
docker compose down -v          # also remove volumes (wipes the database)
```

## 4. Deploying for production

Production uses `docker-compose.prod.yml`, which runs **pre-built, tagged images**
(`visarch-client`, `visarch-api`, `visarch-websocket`) instead of building from source,
and sets `NODE_ENV=production`.

### 4.1 Configure the environment

In your `.env`, set `APP_URL` to the public domain (no protocol), and make sure the
production OAuth redirect URIs (`https://YOUR_DOMAIN/api/auth/callback/{google,github}`)
are registered in the Google and GitHub apps (see section 1).

### 4.2 Build and tag the production images

The client must be built with `NODE_ENV=production`:

```bash
docker build -t visarch-client:latest    --build-arg NODE_ENV=production ./client
docker build -t visarch-api:latest        ./server/api
docker build -t visarch-websocket:latest  ./server/websocket
```

> If you build on one machine and deploy on another, push these images to a registry
> and reference them from `docker-compose.prod.yml`, or transfer them with
> `docker save` / `docker load`.

### 4.3 Run the production stack

```bash
docker compose -f docker-compose.prod.yml up -d
```

The `client` service is published on host port `3000`. Place a TLS-terminating reverse
proxy (e.g. Nginx, Traefik, or a cloud load balancer) in front of it so that `APP_URL`
is served over HTTPS — the OAuth callbacks require `https://`.

To update a running deployment, rebuild the changed image(s) and re-run:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```
