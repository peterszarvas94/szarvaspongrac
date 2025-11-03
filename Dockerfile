# Build stage
FROM alpine:latest AS builder
RUN apk add --no-cache wget tar
RUN wget -O hugo.tar.gz https://github.com/gohugoio/hugo/releases/download/v0.120.4/hugo_extended_0.120.4_linux-amd64.tar.gz
RUN tar -xzf hugo.tar.gz && mv hugo /usr/local/bin/
WORKDIR /src
COPY . .
RUN hugo --minify --gc

# Serve stage
FROM public.ecr.aws/nginx/nginx:stable-alpine
COPY --from=builder /src/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]