const { ApolloClient } = require('apollo-client')
const gql = require("graphql-tag")

const { createHttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const fetch = require('node-fetch')
const { TokenListProvider } = require('@solana/spl-token-registry')
const followRedirects = require('follow-redirects')
const fs = require('fs')
const path = require('path')
const Spritesmith = require('spritesmith')
const sharp = require('sharp')

const markets = require('aldrin-registry/src/markets.json')

const ALLOWED_EXTENSION = ['.png', '.svg']

const API_ENDPOINT = 'https://api.cryptocurrencies.ai/graphql'
const SINGLE_IMAGE_SIZE = 64
const CUSTOM_TOKEN_ICONS_DIR = `${__dirname}/customTokenIcons`
const ICONS_DIR = `${__dirname}/icons`
const OUTPUT_DIR = `${__dirname}/output`
const SPRITE_IMAGE_FILENAME = 'token-icons.webp'
const SPRITE_JSON_FILENAME = 'token-icons.json'
const SPRITE_IMAGE_FILE = `${OUTPUT_DIR}/${SPRITE_IMAGE_FILENAME}`
const SPRITE_JSON_FILE = `${OUTPUT_DIR}/${SPRITE_JSON_FILENAME}`
const DIR_TO_MOVE_OUTPUT = `${__dirname}/../../src/storybook/src/web/components/TokenIcon/sprite`

const CUSTOM_TOKEN_IMAGES = [
  { imageUri: `${CUSTOM_TOKEN_ICONS_DIR}/sunny_logo.jpg`, symbol: 'SUNNY', mint: 'SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag' } ,
  { imageUri: `${CUSTOM_TOKEN_ICONS_DIR}/ptr_logo.png`, symbol: 'PRT', mint: 'JET6zMJWkCN9tpRT2v2jfAmm5VnQFDpUBCyaKojmGtz' },
  { imageUri: `${CUSTOM_TOKEN_ICONS_DIR}/syp_logo.png`, symbol: 'SYP', mint: 'FnKE9n6aGjQoNWRBZXy4RW6LZVao7qwBonUbiD7edUmZ' },
  { imageUri: `${CUSTOM_TOKEN_ICONS_DIR}/sfcn_logo.png`, symbol: 'SFCN', mint: '5abCYCzwJLtazvtAZEPcHaEoB2zZ6xNFEmM36o6qyAHy' },
  { imageUri: `${CUSTOM_TOKEN_ICONS_DIR}/alm_logo.png`, symbol: 'ALM', mint: 'ALMmmmbt5KNrPPUBFE4dAKUKSPWTop5s3kUGCdF69gmw' },
  { imageUri: `${CUSTOM_TOKEN_ICONS_DIR}/fries_logo.png`, symbol: 'FRIES', mint: 'FriCEbw1V99GwrJRXPnSQ6su2TabHabNxiZ3VNsVFPPN' },
  { imageUri: `${CUSTOM_TOKEN_ICONS_DIR}/sob_logo.png`, symbol: 'SOB', mint: 'EkDf4Nt89x4Usnxkj4sGHX7sWxkmmpiBzA4qdDkgEN6b' },
  { imageUri: `${CUSTOM_TOKEN_ICONS_DIR}/gmcoin_logo.jpg`, symbol: 'GMCOIN', mint: 'A9Nc6Yo9YGKsaeAb2nsQFSQpLcdotGqjEJmEQFzZeeqX' },
  { imageUri: `${CUSTOM_TOKEN_ICONS_DIR}/otr_logo.jpg`, symbol: 'OTR', mint: '6TgvYd7eApfcZ7K5Mur7MaUQ2xT7THB4cLHWuMkQdU5Z' }
]

const poolsQuery = gql`
  query getPoolsInfo {
    getPoolsInfo {
      name
      parsedName
      tokenA
      tokenB
    }
  }
`

const download = (url, dest, method = followRedirects.https) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest, { flags: "wx" })

    const request = method.get(url, { timeout: 10000 }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
      } else {
        console.log('Error Downloading. Not accepted status code: ', response.statusCode);
        file.close()

        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest)
        }
        reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`)
      }
    })

    request.on("error", (err) => {
      file.close()

      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest)
      }

      reject(err.message)
    })

    file.on("finish", () => {
      resolve()
    })

    file.on("error", err => {
      file.close()

      if (err.code === "EEXIST") {
        reject(`File already exists: ${dest}`)
      } else {

        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest)
        }

        reject(err.message)
      }
    })
  })
}

const run = async () => {
  try {
    fs.rmSync(ICONS_DIR, { recursive: true, force: true })
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })

    fs.mkdirSync(ICONS_DIR)
    fs.mkdirSync(OUTPUT_DIR)
  } catch (e) {
    console.log('Error: ', e)
  }

  const httpLink = createHttpLink({
    uri: API_ENDPOINT,
    fetch,
  })

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  })

  const {
    data: { getPoolsInfo },
  } = await client.query({
    query: poolsQuery,
  })

  const poolSymbolsList = [...new Set(getPoolsInfo.reduce((curr, next) => {
    return [...curr, next.tokenA, next.tokenB]
  }, []))]

  console.log(`[1/11] Getting aldrin tokens from pools. Found: ${poolSymbolsList.length}`)

  const marketSymbolsList = [...new Set(markets.reduce((curr, next) => ([...curr, ...next.name.split('/')]), []))]

  console.log(`[2/11] Getting aldrin tokens from markets. Found: ${marketSymbolsList.length}`)

  const tokenListProvider = new TokenListProvider()
  const { tokenList } = await tokenListProvider.resolve()

  const tokensAldrinList = tokenList.filter((item) => item.logoURI).reduce((curr, next) => {
    const isOk = poolSymbolsList.includes(next.address) || marketSymbolsList.includes(next.symbol)

    if (isOk) {
      return [
        ...curr,
        {
          symbol: next.symbol,
          mint: next.address,
          logoUrl: next.logoURI,
        }]
    }

    return curr
  }, [])

  console.log(`[4/11] Get aldrin tokens from registry. Found: ${tokensAldrinList.length}`)

  for (let i = 0; i < tokensAldrinList.length; i++) {
    const item = tokensAldrinList[i]
    const ext = path.extname(item.logoUrl)
    const extToStore = ALLOWED_EXTENSION.includes(ext) ? ext : '.png'

    try {
      process.stdout.write(`[5/11] Downloading: ${item.symbol} (${i+1}/${tokensAldrinList.length})\r`)
      await download(item.logoUrl, `${ICONS_DIR}/${item.symbol}-${item.mint}${extToStore}`)
    } catch(e) {
      console.log(`Error downloading: ${item.symbol} at ${item.logoUrl}`, e)
    }
  }

  console.log(`[6/11] Get tokens from custom tokens folder. Found: ${CUSTOM_TOKEN_IMAGES.length}`)

  CUSTOM_TOKEN_IMAGES.forEach((item) => {
    const ext = path.extname(item.imageUri)
    fs.copyFileSync(item.imageUri, `${ICONS_DIR}/${item.symbol}-${item.mint}${ext}`)
  })

  let images = fs.readdirSync(ICONS_DIR)

  console.log(`[7/11] Compressing images (${images.length})`)

  for (let i = 0; i < images.length; i++) {
    const item = images[i]
    try {
      const buffer = await sharp(`${ICONS_DIR}/${item}`).resize(SINGLE_IMAGE_SIZE).png().toBuffer()

      const oldExt = path.extname(`${ICONS_DIR}/${item}`)

      if (oldExt !== '.png') {
        fs.unlinkSync(`${ICONS_DIR}/${item}`)
      }

      fs.writeFileSync(`${ICONS_DIR}/${item}`.replace(oldExt, '.png'), buffer, () => {})
    } catch (e) {
      console.log('Error: ', e, `\nRemoving ${ICONS_DIR}/${item}`)
      fs.unlinkSync(`${ICONS_DIR}/${item}`)
    }
  }

  images = fs.readdirSync(ICONS_DIR)

  console.log(`[8/11] Creating sprite (${images.length})`)

  Spritesmith.run({
    src: images.map((item) => `${ICONS_DIR}/${item}`),
    engine: require('canvassmith'),
  }, async (err, result) => {
    if (err) {
      throw err
    }

    console.log(`[9/11] Converting to webp`)

    await sharp(result.image).webp().toFile(SPRITE_IMAGE_FILE)

    const styles = Object.keys(result.coordinates).reduce((curr, next) => {
      const coords = result.coordinates[next]
      const parsedPath = path.parse(next)

      return {
        ...curr,
        [parsedPath.name]: coords
      }
    }, {})

    console.log(`[10/11] Making JSON descriptor file`)

    fs.writeFileSync(SPRITE_JSON_FILE, JSON.stringify({
      createdAt: Date.now(),
      webpFilename: SPRITE_IMAGE_FILENAME,
      icons: images.map((item) => {
        const parsedPath = path.parse(item)

        const [token, address] = parsedPath.name.split('-')

        return {
          token,
          address,
          styles: {
            width: `${styles[parsedPath.name].width}px`,
            height: `${styles[parsedPath.name].height}px`,
            backgroundPosition: `-${styles[parsedPath.name].x}px -${styles[parsedPath.name].y}px`,
          }
        }
      })
    }, null, 2))

    console.log(`[11/11] Cleanup`)

    try {
      fs.rmSync(ICONS_DIR, { recursive: true, force: true })
      fs.rmSync(DIR_TO_MOVE_OUTPUT, { recursive: true, force: true })

      fs.mkdirSync(DIR_TO_MOVE_OUTPUT)

      fs.copyFileSync(SPRITE_JSON_FILE, `${DIR_TO_MOVE_OUTPUT}/${SPRITE_JSON_FILENAME}`)
      fs.copyFileSync(SPRITE_IMAGE_FILE, `${DIR_TO_MOVE_OUTPUT}/${SPRITE_IMAGE_FILENAME}`)
    } catch (e) {
      console.log('Error: ', e)
    }
  })
}

run()
