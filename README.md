# plantlab

## Firmware
idf 
    to start venv and make idf.py available

idf.py build
idf.py flash
idf.py monitor

Ctrl+T, then Ctrl+X to exit.


## API

Update Service:
docker compose -f infrastructure/docker-compose.yml down
docker compose -f infrastructure/docker-compose.yml up -d

Run API:
go run .
