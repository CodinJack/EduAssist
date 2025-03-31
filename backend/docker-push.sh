#!/usr/bin/bash
docker build -t eduassist_api:latest .
docker tag eduassist_api rakim0/eduassist_api:latest
docker push rakim0/eduassist_api

