FROM debian:buster

WORKDIR /home/bun/app

# Install required dependencies
RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Create a non-root user 'bun' & Change ownership of the Bun installation directory to 'bun'
RUN useradd -m -s /bin/bash bun && chown -R bun:bun /root/.bun

# Set the home directory for 'bun' user
ENV HOME=/home/bun

# Copy the Bun binary to a location that the 'bun' user can access
RUN cp -r /root/.bun $HOME/.bun

# Add the Bun binary to the 'bun' user's PATH
ENV PATH="$HOME/.bun/bin:$PATH"

COPY --from=node:20-buster /usr/lib /usr/lib
COPY --from=node:20-buster /usr/local/share /usr/local/share
COPY --from=node:20-buster /usr/local/lib /usr/local/lib
COPY --from=node:20-buster /usr/local/include /usr/local/include
COPY --from=node:20-buster /usr/local/bin /usr/local/bin

RUN apt-get update && apt-get install -y supervisor

# Switch to 'bun' user
USER bun

ENTRYPOINT [ "./scripts/bun.sh" ]

