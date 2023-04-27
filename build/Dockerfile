FROM node:lts

WORKDIR /usr/app
COPY .. /usr/app

VOLUME [ "/usr/app/dist" ]

RUN npm install pkg -g && \
    npm install

# ENTRYPOINT [ "pkg", "-t", "node16-linux-x64,node16-linux-arm64,node16-macos-x64,node16-linux-x64", "."]