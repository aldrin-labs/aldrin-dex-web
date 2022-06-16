const { ApolloClient } = require('apollo-client')
const gql = require("graphql-tag");
const { createHttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const fetch = require('node-fetch')
const { TokenListProvider } = require('@solana/spl-token-registry')
const http = require('follow-redirects').https
const fs = require('fs')
const path = require('path')
const Spritesmith = require('spritesmith')
const sharp = require('sharp')

const markets = require('./../../src/core/src/utils/awesomeMarkets/markets.json')

const ALLOWED_EXTENSION = ['.png', '.svg']

const API_ENDPOINT = 'https://api.cryptocurrencies.ai/graphql'
const SINGLE_IMAGE_SIZE = 64
const ICONS_DIR = `${__dirname}/icons`
const OUTPUT_DIR = `${__dirname}/output`
const SPRITE_IMAGE_FILENAME = 'token-icons.webp'
const SPRITE_JSON_FILENAME = 'token-icons.json'
const SPRITE_IMAGE_FILE = `${OUTPUT_DIR}/${SPRITE_IMAGE_FILENAME}`
const SPRITE_JSON_FILE = `${OUTPUT_DIR}/${SPRITE_JSON_FILENAME}`
const DIR_TO_MOVE_OUTPUT = `${__dirname}/../../src/storybook/src/web/components/TokenIcon/sprite`


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

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest, { flags: "wx" });

    const request = http.get(url, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
      } else {
        file.close();
        fs.unlink(dest, () => {}); // Delete temp file
        reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
      }
    });

    request.on("error", err => {
      file.close();
      fs.unlink(dest, () => {}); // Delete temp file
      reject(err.message);
    });

    file.on("finish", () => {
      resolve();
    });

    file.on("error", err => {
      file.close();

      if (err.code === "EEXIST") {
        reject(`File already exists: ${dest}`);
      } else {
        fs.unlink(dest, () => {}); // Delete temp file
        reject(err.message);
      }
    });
  });
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

  const poolSymbolsList = getPoolsInfo.reduce((curr, next) => {
    return [...curr, next.tokenA, next.tokenB]
  }, [])

  console.log(`[1/10] Getting aldrin tokens from pools. Found: ${poolSymbolsList.length}`)

  const marketSymbolsList = markets.reduce((curr, next) => {
    if (!curr.includes(next.name)) {
      return [...curr, next.name]
    }

    return curr
  }, [])

  console.log(`[2/10] Getting aldrin tokens from markets. Found: ${marketSymbolsList.length}`)

  const tokenSymbolsList = [...new Set([...poolSymbolsList, marketSymbolsList])]

  console.log(`[3/10] Uniq tokens to find in registry: ${tokenSymbolsList.length}`)

  const tokenListProvider = new TokenListProvider()
  const { tokenList } = await tokenListProvider.resolve()

  const tokensAldrinList = tokenList
    .filter((item) => tokenSymbolsList.includes(item.address))
    .map((item) => ({ symbol: item.symbol, mint: item.address, logoUrl: item.logoURI }))

  console.log(`[4/10] Get aldrin tokens from registry. Found: ${tokensAldrinList.length}`)

  if (tokenSymbolsList.length !== tokensAldrinList.length) {
    const notFoundSymbolsList = tokenSymbolsList
      .filter((item) => {
        return !tokenList.find((item2) => item2.address === item)
      })
      .map((item) => {
        return getPoolsInfo.find((item2) => [item2.tokenA, item2.tokenB].includes(item))
      })
    console.log(`Warning: Not found in registry`, notFoundSymbolsList)
  }

  for (let i = 0; i < tokensAldrinList.length; i++) {
    const item = tokensAldrinList[i]
    const ext = path.extname(item.logoUrl)
    const extToStore = ALLOWED_EXTENSION.includes(ext) ? ext : '.png'

    try {
      process.stdout.write(`[5/10] Downloading: ${item.symbol} (${i+1}/${tokensAldrinList.length})\r`)
      await download(item.logoUrl, `${ICONS_DIR}/${item.symbol}-${item.mint}${extToStore}`)
    } catch(e) {
      console.log('Error: ', e)
    }
  }

  const images = fs.readdirSync(ICONS_DIR)

  console.log(`[6/10] Compressing images`)

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    const buffer = await sharp(`${ICONS_DIR}/${item}`).resize(SINGLE_IMAGE_SIZE).toBuffer();

    fs.writeFileSync(`${ICONS_DIR}/${item}`, buffer, () => {});
  }

  console.log(`[7/10] Creating sprite`)

  Spritesmith.run({
    src: images.map((item) => `${ICONS_DIR}/${item}`),
    engine: require('canvassmith'),
  }, async (err, result) => {
    if (err) {
      throw err;
    }

    console.log(`[8/10] Converting to webp`)

    await sharp(result.image).webp().toFile(SPRITE_IMAGE_FILE)

    const styles = Object.keys(result.coordinates).reduce((curr, next) => {
      const coords = result.coordinates[next]
      const parsedPath = path.parse(next)

      return {
        ...curr,
        [parsedPath.name]: coords
      }
    }, {})

    console.log(`[9/10] Making JSON descriptor file`)

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
    }, null, 2));

    console.log(`[10/10] Cleanup`)

    try {
      fs.rmSync(ICONS_DIR, { recursive: true, force: true })
      fs.rmSync(DIR_TO_MOVE_OUTPUT, { recursive: true, force: true })

      fs.mkdirSync(DIR_TO_MOVE_OUTPUT)

      fs.copyFileSync(SPRITE_JSON_FILE, `${OUTPUT_DIR}/${SPRITE_JSON_FILENAME}`)
      fs.copyFileSync(SPRITE_IMAGE_FILE, `${OUTPUT_DIR}/${SPRITE_IMAGE_FILENAME}`)
    } catch (e) {
      console.log('Error: ', e)
    }
  });
}

run()
