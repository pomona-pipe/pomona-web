import { createClient } from 'redis'
import { Dropbox } from 'dropbox/dist/Dropbox-sdk.min'
import fetch from 'isomorphic-fetch'

// frontend server
export const frontendServerUrl = process.env.FRONTEND_SERVER_URL!

// redis
const redisPort = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT)
  : 6379
const redisHost = process.env.REDIS_HOST || '127.0.0.1' // env var in Dockerfile
export const redisClient = createClient(redisPort, redisHost)
export const redisCacheTime = 3600

// aws
export const cloudfrontUrl = 'https://d113q3lewv5kc2.cloudfront.net'

// dropbox
export const dropboxRoot = '/2020 Website'
export const dropbox = (() => {
  const {
    DROPBOX_APP_KEY,
    DROPBOX_APP_SECRET,
    DROPBOX_ACCESS_TOKEN
  } = process.env
  const options: DropboxTypes.DropboxOptions = {
    fetch,
    accessToken: DROPBOX_ACCESS_TOKEN!,
    clientId: DROPBOX_APP_KEY!
  }
  const dropbox = new Dropbox(options)
  dropbox.setClientSecret(DROPBOX_APP_SECRET!)
  return dropbox
})()

// prismic
export const prismicMaxPerPage = 50
