FROM node:24-bookworm-slim AS assets
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run css && npm run bundle:tiptap

FROM golang:1.26.9-bookworm AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=assets /src/static/ ./static/
RUN go run github.com/a-h/templ/cmd/templ@v0.3.1020 generate \
    && go run ./cmd/assets \
    && CGO_ENABLED=0 go build -trimpath -ldflags='-s -w' -o /out/server ./cmd/server

FROM alpine:3.22
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=build /out/server ./server
COPY --from=build /src/static/ ./static/
COPY --from=build /src/public/ ./public/
ENV APP_ENV=production PORT=4321
USER 10001:10001
EXPOSE 4321
CMD ["./server"]
