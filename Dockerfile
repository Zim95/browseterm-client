FROM nginx:latest

# COPY EVERYTHING INTO THE DIRECTORY
RUN mkdir app
COPY . app/
WORKDIR /app

# Now comes the Nginx part
RUN cp browsetermclient.nginx.conf \
    /etc/nginx/conf.d/browsetermclient.nginx.conf
EXPOSE 8001

# Start the container
CMD ["nginx", "-g", "daemon off;"]
