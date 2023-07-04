# Dash Upload

## Getting started

1. Download this git repository
2. Build using docker

```bash
cd server
docker build  .

cd frontend
docker build .
```

I recommend running using docker compose.

Example docker-compose.yaml file

```bash
version: "3.9"
services:
    file_server_database:
        image: mariadb:latest
        container_name: file_server_database
        command: --default-authentication-plugin=mysql_native_password
        restart: always
        volumes:
        - ./file_server.sql:/docker-entrypoint-initdb.d/file_server.sql
        - $HOME/file_server_database:/var/lib/mysql
        environment:
        MYSQL_DATABASE: file_server
        MYSQL_USER:
        MYSQL_PASSWORD:
        MYSQL_ROOT_PASSWORD:
        SERVICE_TAGS: dev
        SERVICE_NAME: file_server_database
        ports:
        - 3306:3306
        expose:
        - 3306
        networks:
        - fileserver
    file_server:
        image: build img
        container_name: file_server
        ports:
        - 9000:9000
        expose:
        - 9000
        restart: always
        volumes:
        - path_to_volume
        environment:
        HOST: your_host_name
        PORT: 9000
        DBPORT: 3307
        USER: ''
        PASSWORD: ''
        DB:
        SERVICE_TAGS: dev
        SERVICE_NAME: file_server
        networks:
        - fileserver
        depends_on:
        - file_server_database
    dash_upload:
        image: frontend build img
        container_name: dash_upload
        ports:
        - 80:80
        restart: always
        environment:
            NEXTAUTH_SECRET: ""
            NEXTAUTH_URL: ""
            GOOGLE_CLIENT_ID: ""
            GOOGLE_CLIENT_SECRET: ""
            GITHUB_CLIENT_ID: ""
            GITHUB_CLIENT_SECRET: ""
        depends_on:
        - file_server

    networks:
  fileserver:
    driver: bridge

```
