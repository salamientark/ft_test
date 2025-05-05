FROM node:22.14.0

WORKDIR /app

COPY ./conf/package*.json ./

RUN npm install

COPY --chown=node:node conf ./

EXPOSE 3003

ENTRYPOINT ["npm"]
CMD ["run", "start"]
