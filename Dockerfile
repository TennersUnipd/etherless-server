FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install && \
	npm install -g ts-node typescript@3.6 && \
	npm audit fix
	
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "ts-node", "src/index.ts"]