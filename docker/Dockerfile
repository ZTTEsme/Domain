FROM nginx:1.25-alpine

RUN apk add jq

COPY build/ /usr/share/nginx/html
COPY docker/check-in.sh /app/bin/check-in.sh

CMD sh /app/bin/check-in.sh
