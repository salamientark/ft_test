FROM node:22.14.0

WORKDIR /app

COPY conf/package*.json ./

RUN npm install

### DEV ###
RUN npm install -g nodemon
RUN npm install -D typescript @types/node

COPY --chown=node:node conf ./

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm"]
CMD ["run", "start"]
