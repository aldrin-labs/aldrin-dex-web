# web repo

The web repo is React application that also must consist two submodules — core and storybook.


To start using it from developer side you should:

1. Clone the repo: `git clone https://gitlab.com/crypto_project/frontend/web.git`, or do it by ssh.
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
3. Type: `git remote add coreOrigin https://gitlab.com/crypto_project/frontend/core.git`

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






___________
Notes:

1. If somehow happened, that the staging api (api develop branch) would not work, and your work depends on working backend, you should change few
line of code to switch to the production api (api master branch). In this case, you should open file in core repo (@core/utils/config), and change 4th line from this "const addDevelopToURL = (URL: string) => `develop.${URL}`" to this "const addDevelopToURL = (URL: string) => `${URL}`". In that case, you will use prod api after you rebuild the web project. You may also clear the `dist` folder in your project before rebuild to make sure that cached js
code will not affect on this action.
