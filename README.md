# web repo

The web repo is React application that also must consist two submodules — core and storybook.

To start using it from developer side you should:

1. Clone the repo: `git clone https://gitlab.com/crypto_project/frontend/web.git`, or do it by ssh.
   1.1. Confirm that your nodejs version matches the version in .nvmrc file inside this repo. If it doesn't match, install the nodejs version that matches .nvmrc
2. Install dependencies: `yarn` (use yarn only, not npm!)
3. Install submodules: `yarn submodule`
4. Build project with developer environment: `yarn dev:fast`

There is also one major moment of using submodules — you can't commit push your changes directly using submodule token from another repository (e.g. web repo).
_(You can try to do it and you would see the next error after you will try to push:
remote: You are not allowed to upload code.
fatal: unable to access 'https://gitlab+deploy-token-57725:f63zLxs1zDAMvhF_uqJv@gitlab.com/crypto_project/frontend/core.git/': The requested URL returned error: 403
master
)_

There are two separate ways to do that:

1. Add another remote for each of two web repo submodules: core and storybook.
2. Clone submodules (core and storybook) to the same directory in your filesystem and use them with scripts in web repo: `fetch-local-core` and `fetch-local-storybook`.

The first way steps:

1. Open terminal and go to web repo directory.
2. Type: `cd src/core`. (you should move to the core submodule inside web repo)
3. Type: `git remote add coreOrigin git@gitlab.com:crypto_project/frontend/core.git`

These steps should create another remote and you should use `coreOrigin` remote when you want to push changes to `core` submodule inside web repo.
The final command would look like: `git push coreOrigin <branchname>`, where `<branchname>` - is the name of the branch that you want to push to the remote branch.
For the storybook repo you should do the same steps as for core repo.

The second way steps:

1. Go to the directory that consist(!) web repo.
   In our example, it would be `crypto` directory, e.g. `...\users\work\crypto\web\`
   Your terminal should be opened in `crypto` directory.
2. Clone 2 repos: core & storybook into the `crypto` directory. As the result your crypto directory should have this structure:

- crypto
- web
- core
- storybook

3. Then you should open these two repos ( core & storybook ) in your favorite IDE in separate projects (or open the crypto directory as only one project, it's up to you)
4. You can these two repos ( core & storybook ) as common repos. You also will be able to push inside these two repos as usual.
   When you want to see the changes in these repos that affect to the web repo, you should use next commands: `fetch-local-core` for core and `fetch-local-storybook` for storybook inside web repo. These commands will copy files from core or storybook directories inside `crypto` directory (!), and paste them to `src` folder inside web repo.

---

Notes:

1. If somehow happened, that the staging api (api develop branch) would not work, and your work depends on working backend, you should change few
   line of code to switch to the production api (api master branch). In this case, you should open file in core repo (@core/utils/config), and change 4th line from this "const addDevelopToURL = (URL: string) => `develop.${URL}`" to this "const addDevelopToURL = (URL: string) => `${URL}`". In that case, you will use prod api after you rebuild the web project. You may also clear the `dist` folder in your project before rebuild to make sure that cached js
   code will not affect on this action.

2. Please note that "@project-serum/serum": "0.13.25", "@solana/web3.js": "0.90.0" should be same in web, api and xpull_exchanges
   coz if one of this packages version will change version it can produce issues with number of markets.

---

### Bundle analyzing:

use build:bundleanalyzer:without:submodule

---

### Token icons sprite generation

Requirements:
  
  - node 8+
  - pkg-config, pixman, cairo, pangocairo
  - any other packages that you be ask for (@todo)

Usage: `yarn token-icons-sprite-generate`

The command accepts no params and does the following:
1. Collect token names

    1.1. from the aldrin pools
   
    1.2. from aldrin-registry markets 
    
    1.3. from custom local folder

2. Download an icons (except those in 1.3)
  
    2.1. Iterate over the token names and trying to find those in [spl-token-registry](https://www.npmjs.com/package/@solana/spl-token-registry)

    2.2. Download for those found

3. Compressing

    we resize each image to fit 64px square
   
4. Creating the sprite
   
    we make it with [spritesmith](https://www.npmjs.com/package/spritesmith) library powered by [canvassmith](https://www.npmjs.com/package/canvassmith) so let's leave it the blackbox as long as it works well
    
5. Converting to webp

6. Make a json-descriptor file
    we store the following data there:
      - link to .webp image
      - token name/address
      - the dimensions of each image (token)
      - coordinates in sprite (x/y)
  
7. Moving it to the target folder
    once we good we move our output to the target `TokenIcon` component's folder
   
    that components know already how to operate with the image/json

  TODO:

  - make it on CI but not manually (like we have it now)
  - provide some more requirements 

---

# Swap Hook
Swap logic separated to another gitlab repository.
For using it we need to specify url for scoped package in .npmrc with deploy token,
that have read_package_registry permission, so we'll have access to package registry of this repo.

# Useful links:
## Production:
- Website: https://aldrin.com
- API: https://api.cryptocurrencies.ai/playground

## Dev:
- Website: ???
- API: https://develop.api.cryptocurrencies.ai/playground


--- 
# Environment

You can configure the app through environment variables. All parameters are optional and not needed to run app.

## Available variables

| Variable                 | Description | Value example                                                     |
| ------------------------ | ----------- | ----------------------------------------------------------------- |
| RPC_PROVIDERS_ADDRESSES  | Title       | [{ url: 'https://frontend-solana-api-1.aldrin.com', weight: 20 }]
