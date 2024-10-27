import fsSync from 'fs'
import fsAsync from 'fs/promises'
import url from 'url'
import path from 'path'
import express from 'express'
import ffmpeg from 'fluent-ffmpeg'
import cors from 'cors'
import multer from 'multer'

const __FILENAME = url.fileURLToPath(import.meta.url),
      __DIRNAME  = path.dirname(__FILENAME)

let PATHS = {
  __DIRNAME,
  __FILENAME,
  TMP_PATH: `${__DIRNAME}\\tmp`, 
  OUTPUT_PATH: `${__DIRNAME}\\output`,
  TMP_FILE_PATH: '',
  OUTPUT_FILE_PATH: ''
}

const server = express(),
      storage = multer.diskStorage({ destination: (_, __, cb) => cb(null, PATHS.TMP_PATH), filename: (_, file, cb) => cb(null, file.originalname) }),
      upload = multer({ storage: storage })

server.use(cors())
server.use(express.urlencoded({ extended: true }))

if(!fsSync.existsSync(PATHS.TMP_PATH)) {
  console.log(`> Create tmp directory ${PATHS.TMP_PATH}`)
  await fsAsync.mkdir(PATHS.TMP_PATH)
} else console.log('> Temporary path exist')

if(!fsSync.existsSync(PATHS.OUTPUT_PATH)) {
  console.log(`> Create output directory ${PATHS.OUTPUT_PATH}`)
  await fsAsync.mkdir(PATHS.OUTPUT_PATH)
} else console.log('> Output path exist')

server.post('/upload', upload.single('file'), async (req, res) => {
  if(!req?.file) return res.status(400).send({ message: 'File is not defined!' })

  PATHS = {
    ...PATHS,
    TMP_FILE_PATH: path.normalize(`${PATHS.TMP_PATH}/${req.file.originalname}`),
    OUTPUT_FILE_PATH: path.normalize(`${PATHS.OUTPUT_PATH}/${req.file.originalname}`)
  }

  console.log('> Paths configuration = ', PATHS)

  try {
    await compress()
    await fsAsync.rm(PATHS.TMP_FILE_PATH)
  } catch(error) {
    console.log(error.message)
  }
  
  console.log(`> Remove file from ${PATHS.TMP_FILE_PATH}`)

  res.status(200).send({ OUTPUT_FILE_PATH: PATHS.OUTPUT_FILE_PATH })
})

async function compress() {
  return new Promise((resolve, reject) => {
    ffmpeg(PATHS.TMP_FILE_PATH)
      .output(PATHS.OUTPUT_FILE_PATH)
      .videoCodec('libx265')
      .size('50%')
      .on('end', () => resolve(PATHS.OUTPUT_FILE_PATH))
      .on('error', (error) => reject(error.message))
      .run()
  })
}

server.listen(4020)