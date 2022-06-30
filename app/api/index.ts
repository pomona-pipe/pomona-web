import express from 'express'
import updateS3FromDropbox from './routes/s3/syncFromDropbox'
import getImages from './routes/prismic/images'
import getPdfs from './routes/prismic/pdfs'
import getVideos from './routes/prismic/videos'
import sendToAlgolia from './routes/algolia/sendPrismicPages'
import slackChannelPost from './routes/forms/sendToSlack'
import sendEmail from './routes/forms/sendEmail'

// create express server
const app = express()

// enable body parsing
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

// add routes
app.use(
  updateS3FromDropbox,
  getImages,
  getPdfs,
  getVideos,
  sendToAlgolia,
  slackChannelPost,
  sendEmail,
)

export default app
