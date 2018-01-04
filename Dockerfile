# FROM alpine:3.4
FROM mhart/alpine-node:9.3.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --only=prod

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "node", "--harmony" ,"./bin/start.js" ]
