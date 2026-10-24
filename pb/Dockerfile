FROM alpine:3.22 AS download
RUN apk add --no-cache curl unzip
ARG TARGETARCH
WORKDIR /download
RUN case "$TARGETARCH" in \
      amd64) checksum=e6cb338e54329e328e4f42b999ac820901d2d23b7e7562417259b0ef882edf9c ;; \
      arm64) checksum=e6a6ca0ee3c2acc369dc6965d555760a66b3540c13ba863d28dbc2ec77d325f1 ;; \
      *) echo "Unsupported architecture: $TARGETARCH" >&2; exit 1 ;; \
    esac \
    && curl -fsSL "https://github.com/pocketbase/pocketbase/releases/download/v0.37.4/pocketbase_0.37.4_linux_${TARGETARCH}.zip" -o pocketbase.zip \
    && echo "$checksum  pocketbase.zip" | sha256sum -c - \
    && unzip pocketbase.zip pocketbase

FROM alpine:3.22
RUN apk add --no-cache ca-certificates \
    && mkdir -p /pb/pb_data /pb/pb_migrations \
    && chown -R 10001:10001 /pb
WORKDIR /pb
COPY --from=download /download/pocketbase ./pocketbase
COPY --chown=10001:10001 pb/pb_migrations/ ./pb_migrations/
USER 10001:10001
EXPOSE 8090
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
