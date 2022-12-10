# Build Web App
FROM node:18 AS build_app
WORKDIR /opt/build
COPY ./app .
RUN npm i && npm run build:prod

# Build Server
FROM rust:1.65 as build_server
WORKDIR /opt/build
COPY ./server .
RUN cargo build --release

# Run server
FROM ubuntu:jammy
WORKDIR /opt/app
COPY --from=build_app /opt/build/dist ./dist
COPY --from=build_server /opt/build/target/release/xapphire13 .
COPY ./server/templates ./templates
ENV APP_DIR="./dist"
ENV ROCKET_ADDRESS=0.0.0.0
CMD ["./xapphire13"]

EXPOSE 8000