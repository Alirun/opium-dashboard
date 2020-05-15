# build
FROM node:12.2.0-alpine as build

RUN apk add --no-cache make gcc g++ python git

# default environment to test
ARG namespace=test
ENV REACT_APP_NAMESPACE=$namespace

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# runtime
FROM nginx:1.16.1
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]