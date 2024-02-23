FROM oven/bun:debian

WORKDIR /home/bun/app

COPY --from=node:20-buster /usr/lib /usr/lib
COPY --from=node:20-buster /usr/local/share /usr/local/share
COPY --from=node:20-buster /usr/local/lib /usr/local/lib
COPY --from=node:20-buster /usr/local/include /usr/local/include
COPY --from=node:20-buster /usr/local/bin /usr/local/bin

RUN apt-get update && apt-get install -y supervisor

USER bun

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

