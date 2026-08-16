FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY background.jpg /usr/share/nginx/html/background.jpg

EXPOSE 8080
