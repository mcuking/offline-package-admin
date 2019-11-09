FROM node:10.16.3

WORKDIR /usr/src/app

COPY . .

RUN apt-get -y update && \
    apt-get -y install python2.7 && \
    apt-get -y install gcc && \
    npm install --unsafe-perm=true --allow-root
  
EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]
