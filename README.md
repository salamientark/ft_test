# Fastify SPA as microservices

## Laucnhing the containers
You need an env file for every container

###### Backend env file example
```
PORT=3000                       # Container PORT (Need to be adjusted in docker files)
DBFILE="user.db"                # Database MySQL
SALTROUND=10                    # JWT encryption
JWT_SECRET="secret_jwt"         # JWT encryption
COOKIE_SECRET="secret_cookie"   # Secret for cookie encryption
```

###### Frontend env file exemple
```
PORT=3001
```
