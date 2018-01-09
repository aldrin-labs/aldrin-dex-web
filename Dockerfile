FROM socialengine/nginx-spa:latest

COPY build/index.html /app/index.html
COPY dist/ /app