FROM node

WORKDIR . app

COPY . ./package.json

RUN npm i 

EXPOSE 3000 

COPY . .

CMD [ "npm" ,"run","dev" ]
