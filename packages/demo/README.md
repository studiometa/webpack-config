# Demo for the @studiometa/webpack-config CLI

## Run it locally

This project uses NPM workspaces, to avoid module resolution bugs, you should run commands from this package from the project's root:

```bash
# Clone the project and install its dependencies
git clone git@github.com:studiometa/webpack-config.git
cd webpack-config
nvm use # or fnm use
npm install

# Run the demo commands
npm run dev --workspace=@studiometa/webpack-config-demo
npm run build --workspace=@studiometa/webpack-config-demo
```
