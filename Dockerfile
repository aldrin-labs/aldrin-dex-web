FROM socialengine/nginx-spa:latest

COPY public/index.html /app/index.html
COPY dist/ /app