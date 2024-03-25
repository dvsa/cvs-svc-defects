!/bin/sh

lsof -i:8003 | awk '{print $2}' | tail -1