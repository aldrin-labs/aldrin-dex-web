const { ApolloClient } = require('apollo-client')
const gql = require("graphql-tag");
const { createHttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const fetch = require('node-fetch')
const { TokenListProvider } = require('@solana/spl-token-registry')
const http = require('https')
const fs = require('fs')
const path = require('path')
const Spritesmith = require('spritesmith')
const util = require('util')
const sharp = require('sharp')

const markets = require('./../../src/core/src/utils/awesomeMarkets/markets.json')

const ALLOWED_EXTENSION = ['.png', '.svg']

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
  const httpLink = createHttpLink({
    uri: 'https://api.cryptocurrencies.ai/graphql',
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
    const isTokenAInList = curr.includes(next.tokenA)
    const isTokenBInList = curr.includes(next.tokenB)

    const toAdd = []

    if (!isTokenAInList) {
      toAdd.push(next.tokenA)
    }

    if (!isTokenBInList) {
      toAdd.push(next.tokenB)
    }

    return [...curr, ...toAdd]
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

  try {
    // fs.rmSync(`${__dirname}/icons`, { recursive: true, force: true })
    // fs.rmSync(`${__dirname}/output`, { recursive: true, force: true })
    //
    // fs.mkdirSync(`${__dirname}/output`)
    // fs.mkdirSync(`${__dirname}/icons`)
  } catch (e) {
    console.log('Error: ', e)
  }

  // for (let i = 0; i < tokensAldrinList.length; i++) {
  //   const item = tokensAldrinList[i]
  //   const ext = path.extname(item.logoUrl)
  //   const extToStore = ALLOWED_EXTENSION.includes(ext) ? ext : '.png'
  //
  //   try {
  //     process.stdout.write(`[3/10] Downloading: ${item.symbol} (${i+1}/${tokensAldrinList.length})\r`)
  //     await download(item.logoUrl, `${__dirname}/icons/${item.symbol}-${item.mint}${extToStore}`)
  //   } catch(e) {
  //     console.log('Error: ', e)
  //   }
  // }

  const images = fs.readdirSync(`${__dirname}/icons`)

  console.log(`[5/10] Compressing images`)

  const resizePromises = images.map((item) => {
    return sharp(`${__dirname}/icons/${item}`).resize({ width: 64 }).toBuffer((err, buffer) => {
      return fs.writeFile(`${__dirname}/icons/${item}`, buffer, () => {});
    });
  })

  await Promise.all(resizePromises)

  console.log(`[6/10] Creating sprite`)

  Spritesmith.run({
    src: images.map((item) => `${__dirname}/icons/${item}`),
    engine: require('canvassmith'),
    cssOpts: {
      cssClass: (item) => {
        return util.format('.token-icon-%s:before', item.name)
      },
    },
  }, async (err, result) => {
    if (err) {
      throw err;
    }

    fs.writeFileSync(`${__dirname}/output/token-icons.png`, result.image);

    console.log(`[7/10] Converting to webp`)

    await sharp(`${__dirname}/output/token-icons.png`).webp({ quality: 80 }).toFile(`${__dirname}/output/token-icons.webp`)

    console.log(`[8/10] Creating css`)

    const styles = Object.keys(result.coordinates).map((item) => {
      const coords = result.coordinates[item]
      const parsedPath = path.parse(item)
      const className = parsedPath.name

      return (`.${className} {
        background: url("./token-icons.webp") no-repeat;
        width: ${coords.width}px;
        height: ${coords.height}px;
        display: inline-block;
        background-position: ${coords.x}px ${coords.y}px;}`)
    })

    fs.writeFileSync(`${__dirname}/output/token-icons.css`, styles.join('\n\n'));

    console.log(`[9/10] Making JSON descriptor file`)

    fs.writeFileSync(`${__dirname}/output/token-icons.json`, JSON.stringify({
      createdAt: Date.now(),
      webpFilename: 'token-icons.webp',
      cssFilename: 'token-icons.css',
      icons: images.map((item) => ({
        filename: item,
        token: item.split('-')[0],
      }))
    }, null, 2));

    console.log(`[10/10] Cleanup`)

    try {
      // fs.rmSync(`${__dirname}/icons`, { recursive: true, force: true })
    } catch (e) {
      console.log('Error: ', e)
    }
  });
}

run()
