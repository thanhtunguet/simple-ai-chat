FROM nginx:alpine
WORKDIR /var/www/html
COPY ./dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf