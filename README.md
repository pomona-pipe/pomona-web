# [Pomona Pipe Products - Business Website](<(http://pomona-web.us-east-1.elasticbeanstalk.com/)>)

> CMS: Primsic

> Stack: Docker, Nginx, Node, Vue/Nuxt

> Infrastructure: AWS Elastic Beanstalk, Codepipeline

## Development Setup

### Environment Variables
```
# app/.env

# Server-side
ALGOLIA_ADMIN_KEY=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
CONTACT_FORM_EMAIL_RECEPIENTS="johndoe@example.com janedoe@example.com"
CONTACT_FORM_SENDER_EMAIL=""
CONTACT_FORM_BOUNCE_EMAIL=""
CONTACT_FORM_SLACK_WEBHOOK=""
DROPBOX_ACCESS_TOKEN=""
DROPBOX_APP_KEY=""
DROPBOX_APP_SECRET=""
FRONTEND_SERVER_URL="https://www.pomonapipeproducts.com"
NODE_ENV="development"

# Client-side
ALGOLIA_APP_ID=""
ALGOLIA_API_KEY=""
```

### Node Server

```bash
  $ npm install
  $ npm run dev
```

### Docker Container

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

```bash
  $ docker-compose up --build -d
```

- View running containers in Docker Desktop
- Access at `http:///localhost`
