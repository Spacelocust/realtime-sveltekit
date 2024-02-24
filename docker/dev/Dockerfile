FROM debian:buster

WORKDIR /home/bun/app

# Install required dependencies
RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Create a non-root user 'bun'
RUN useradd -m -s /bin/bash bun

# Set the home directory for 'bun' user
ENV HOME=/home/bun

# Copy the Bun binary to a location that the 'bun' user can access and ensure permissions are set correctly
RUN cp -r /root/.bun $HOME/.bun && \
    chown -R bun:bun $HOME && \
    ln -sf $HOME/.bun/bin/bun $HOME/.bun/bin/bunx

# Add the Bun binary to the 'bun' user's PATH
ENV PATH="$HOME/.bun/bin:$PATH"

# Copy the Node.js binaries from the official Node.js Docker image (buster)
COPY --from=node:20-buster /usr/lib /usr/lib
COPY --from=node:20-buster /usr/local/share /usr/local/share
COPY --from=node:20-buster /usr/local/lib /usr/local/lib
COPY --from=node:20-buster /usr/local/include /usr/local/include
COPY --from=node:20-buster /usr/local/bin /usr/local/bin

# Install supervisor
RUN apt-get update && apt-get install -y supervisor

# Switch to 'bun' user
USER bun

ENTRYPOINT [ "./scripts/bun.sh" ]
