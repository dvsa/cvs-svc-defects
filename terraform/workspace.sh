#! /bin/bash

current=$(git branch --show-current |  tr '[:upper:]' '[:lower:]')
branch=${current#feature/}
terraform init -reconfigure || terraform init
terraform workspace select $branch || terraform workspace new $branch
