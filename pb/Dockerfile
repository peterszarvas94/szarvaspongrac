FROM alpine:3.22 AS download
RUN apk add --no-cache curl unzip
ARG TARGETARCH
WORKDIR /download
RUN case "$TARGETARCH" in \
      amd64) checksum=dea29ca40669fb7f31bb47761a8c3494c3f06b42f99d60831bbbcf4bdef5f69d ;; \
      arm64) checksum=631f698900d83ff4b0735a146d33b4e59c99de923f1ae488a90ce58bd6a69f53 ;; \
      *) echo "Unsupported architecture: $TARGETARCH" >&2; exit 1 ;; \
    esac \
    && curl -fsSL "https://github.com/pocketbase/pocketbase/releases/download/v0.34.0/pocketbase_0.34.0_linux_${TARGETARCH}.zip" -o pocketbase.zip \
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
