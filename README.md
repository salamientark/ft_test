# Attempt to make a mode.js fastify app from scratch
----------------------------------------------------
## Setting up the project
Install Node.Js obviously
```bash
mkdir myapp
cd myapp
npm init -y
sed -i -e "s/\"type\": \"commonjs\"/\"type\": \"module\"/" package.json
```
Install fastify and fastify dependencies
```bash
mkdir -p src/{config,controllers,public,routes,views}
```
