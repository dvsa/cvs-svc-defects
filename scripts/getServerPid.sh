#!/bin/sh
lsof -i:3001 | awk '{print $2}' | grep -v '^PID'
