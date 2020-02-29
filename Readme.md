docker build -t <build name> .
docker run -p <local port>:<remote port> -d <build name>
docker ps #show id container
docker exec -it <container id> /bin/bash #navigate container
curl -i localhost:<local port> #check working 