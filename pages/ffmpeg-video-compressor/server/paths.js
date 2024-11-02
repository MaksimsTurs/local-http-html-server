import url from 'url'
import path from 'path'
import fsSync from 'fs'
import fsAsync from 'fs/promises'

const __FILENAME = url.fileURLToPath(import.meta.url),
      __DIRNAME  = path.dirname(__FILENAME)

let PATHS = {
  __DIRNAME,
  __FILENAME,
  TMP_PATH: `${__DIRNAME}\\tmp`, 
  OUTPUT_PATH: `${__DIRNAME}\\output`,
  TMP_FILE_PATH: '',
  OUTPUT_FILE_PATH: '',
  createDirWhenNotExist: async function(path) {
    if(!fsSync.existsSync(path)) {
      console.info(`> Created Directory ${path}`)
      await fsAsync.mkdir(path)
      return 
    }

    console.info(`> Directory ${path} exist`)
  }
}

export default PATHS