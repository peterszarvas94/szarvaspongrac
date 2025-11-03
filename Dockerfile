# Build stage
FROM hugomods/hugo:exts AS builder
WORKDIR /src
COPY . .
RUN hugo --minify --gc

# Serve stage
FROM public.ecr.aws/nginx/nginx:stable-alpine
COPY --from=builder /src/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]