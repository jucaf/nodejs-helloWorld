#! /bin/sh

echo "I'm the run.sh script."
export PRUEBA_CREDENTIALS="deploy/prueba.json"
mkdir prueba
cp server/api.js prueba/api_bck.js
node server/api.js