#!/bin/bash
set -e
echo Starting
sed -i "s|<base href=\"/music\">|<base href=\"$BASE_HREF\">|" /usr/share/nginx/html/index.html
echo Updated base ref to $BASE_HREF
echo Starting nginx
exec nginx -g 'daemon off;'