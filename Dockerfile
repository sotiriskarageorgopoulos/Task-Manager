FROM ubuntu:20.04
MAINTAINER Sotirios Karageorgopoulos
RUN apt-get update && apt-get install -y curl &&\
curl -sL https://deb.nodesource.com/setup_14.x | bash &&\
apt install -y nodejs
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm","start"]


