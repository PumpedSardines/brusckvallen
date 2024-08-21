#!/bin/bash 

while :
do
  npm run build:nocheck

  if [ $? -eq 0 ]; then
    echo "ready" >> /tmp/ready
    echo "healthy" >> /tmp/healthy
  else
    rm /tmp/healthy
  fi

  cp -rf ./dist/* /usr/share/nginx/html
  service nginx reload
  sleep 900 # 15 minutes
done
