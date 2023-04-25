FROM nginx:1.23-alpine

COPY build/ /usr/share/nginx/html
COPY docker/check-in.sh /app/bin/check-in.sh

CMD sh /app/bin/check-in.sh
