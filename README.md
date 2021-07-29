# [Pomona Pipe Products - Business Website](<(http://pomona-web.us-east-1.elasticbeanstalk.com/)>)

> CMS: Primsic

> Stack: Docker, Redis, Nuxt/Typescript

> Infrastructure: AWS Elastic Beanstalk, Codepipeline

## Development Setup

### Node Server

```bash
  $ npm install
  $ npm run dev
```

### Docker Container

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

```bash
  $ docker-compose -f docker-compose.dev.yml up --build -d
```

- View running containers in Docker Desktop
- Access at `http:///localhost`
