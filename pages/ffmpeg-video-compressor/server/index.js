import fsAsync from 'fs/promises'
import path from 'path'
import express from 'express'
import ffmpeg from 'fluent-ffmpeg'
import cors from 'cors'
import multer from 'multer'

import _PATHS from './paths.js'

const server = express(),
      storage = multer.diskStorage({ destination: (_, __, cb) => cb(null, PATHS.TMP_PATH), filename: (_, file, cb) => cb(null, file.originalname) }),
      upload = multer({ storage: storage })

let PATHS = {..._PATHS }

server.use(cors())
server.use(express.urlencoded({ extended: true }))

PATHS.createDirWhenNotExist(PATHS.TMP_PATH)
PATHS.createDirWhenNotExist(PATHS.OUTPUT_PATH)

server.post('/upload', upload.any(), async (req, res) => {
  if(req.files.length === 0) {
    console.error('> Dateien sind nict difiniert!')
    res.status(400).send({ message: 'Datei ist nicht difiniert!' })
    return
  }

  for(let file in req.files) {
    const OUTPUT_FILE_PATH = path.normalize(`${PATHS.OUTPUT_PATH}/${req.body[`${file}-file-name`]}`),
          TMP_FILE_PATH =    path.normalize(`${PATHS.TMP_PATH}/${req.files[file].originalname}`)
          
    PATHS = {
      ...PATHS,
      OUTPUT_FILE_PATH: [...PATHS.OUTPUT_FILE_PATH, OUTPUT_FILE_PATH],
      TMP_FILE_PATH:    [...PATHS.TMP_FILE_PATH, TMP_FILE_PATH]
    }

    try {
      console.info(`> Proccesing file: ${TMP_FILE_PATH}`)
      await compress(TMP_FILE_PATH, OUTPUT_FILE_PATH, { compress: req.body[`${file}-file-compress`] })
      console.info(`> Removed tmp file: ${TMP_FILE_PATH}`)
      await fsAsync.rm(TMP_FILE_PATH)
    } catch(error) {
      console.error(error)
    }
  }

  res.status(200).send({ OUTPUT_FILE_PATH: PATHS.OUTPUT_FILE_PATH })
})

async function compress(srcPath, outPath, options) {
  return new Promise((resolve, reject) => {
    ffmpeg(srcPath)
      .output(outPath)
      .fps(30)
      .addOptions(['-crf 28'])
      .on('end', () => resolve(srcPath))
      .on('error', (error) => reject(error))
      .run()
  })
}

server.listen(4005)