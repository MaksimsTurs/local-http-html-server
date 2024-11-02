import { program } from 'commander'
import fs from 'fs'
import path from 'path'
import url from 'url'
import cors from 'cors'
import express from 'express'
import chalk from 'chalk'
import inquirer from 'inquirer'
import open from 'open'
import childProcces from 'child_process'

import _package from './package.json' with { type: 'json' }

import { QUESTIONS, PATHS_TO_WEBSITES } from './src/constants.js'

const __FILENAME       = url.fileURLToPath(import.meta.url),
      __DIRNAME        = path.dirname(__FILENAME),
      PORT             = 4001,
      PROGRAM_VERSION  = _package.version
      
let CONFIGURATIONS = {
  __FILENAME,
  __DIRNAME,
  PROGRAM_VERSION,
  HTTP_SERVER_URL: `http://localhost:${PORT}`,
  PATH_TO_WEBSITE: '',
  PATH_TO_WEBSITE_SERVER: '',
  PATH_TO_ASSETS: ''
}

program
  .version(PROGRAM_VERSION)
  .description('HTTP Server for Websites.')
  .action(async () => {
    let input

    input = await inquirer.prompt([{ type: 'list', name: 'webiste', choices: QUESTIONS.A1, message: QUESTIONS.Q1 }])
    input = path.normalize(`${__DIRNAME}${PATHS_TO_WEBSITES[input.webiste].replace(/\./, "")}`)
    
    if(fs.existsSync(`${input}\\client`)) {
      CONFIGURATIONS = {
        ...CONFIGURATIONS, 
        PATH_TO_WEBSITE_SERVER: `${input}\\server\\index.js`, 
        PATH_TO_WEBSITE: `${input}\\client\\index.html`,
        PATH_TO_ASSETS: `${input}\\client\\assets`
      }
    } else {
      CONFIGURATIONS = {...CONFIGURATIONS, PATH_TO_ASSETS: `${input}\\assets`, PATH_TO_WEBSITE: `${input}\\index.html` }
    }

    const server = express()

    server.use(cors())
    server.use('/assets', express.static(CONFIGURATIONS.PATH_TO_ASSETS))
    
    server.get('/', (req, res) => {
      console.log(`> Request on URL ${chalk.greenBright(req.url)}, response HTML Page from ${chalk.greenBright(CONFIGURATIONS.PATH_TO_WEBSITE)}`)
      res.sendFile(CONFIGURATIONS.PATH_TO_WEBSITE)
    })
    
    server.listen(PORT, () => {
      console.log(`> Listen port ${chalk.yellowBright(4000)}, configurations =`, CONFIGURATIONS)
      console.log(`> Open URL ${chalk.greenBright(CONFIGURATIONS.HTTP_SERVER_URL)} in default Browser`)
      console.log(`> Start Website Server from ${chalk.greenBright(CONFIGURATIONS.PATH_TO_WEBSITE_SERVER)}`)
      childProcces.spawn('node', [CONFIGURATIONS.PATH_TO_WEBSITE_SERVER], { stdio: 'inherit' })
      open(CONFIGURATIONS.HTTP_SERVER_URL)
    })
  })
  .parse(process.argv)