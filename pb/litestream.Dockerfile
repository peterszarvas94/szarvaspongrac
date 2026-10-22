FROM debian:bookworm-slim AS download
ARG LITESTREAM_VERSION=0.5.17
ARG LITESTREAM_SHA256=cfb371176d164437ae869f8351cfde49bd1804ae71c61923f75c9cba9c9c006d
ADD https://github.com/benbjohnson/litestream/releases/download/v${LITESTREAM_VERSION}/litestream-${LITESTREAM_VERSION}-linux-x86_64.tar.gz /tmp/litestream.tar.gz
RUN echo "$LITESTREAM_SHA256  /tmp/litestream.tar.gz" | sha256sum -c - \
    && tar -xzf /tmp/litestream.tar.gz -C /usr/local/bin litestream

FROM debian:bookworm-slim
RUN apt-get update && apt-get install --no-install-recommends -y ca-certificates sqlite3 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=download /usr/local/bin/litestream /usr/local/bin/litestream
COPY pb/litestream.yml /etc/litestream.yml
COPY --chmod=755 pb/restore.sh /usr/local/bin/restore-pocketbase
USER 10001:10001
ENTRYPOINT ["litestream"]
CMD ["replicate", "-config", "/etc/litestream.yml"]
