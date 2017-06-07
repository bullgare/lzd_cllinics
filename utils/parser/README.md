It's a tool for converting clinics raw data into structured json with geocoding from yandex api.

## Preparations

First copy data from pdf into txt file. Every clinic should start with new line and number-dot-number-dot.

## Start da tool

Parsing data for kids
```
go run ./utils/parser/main.go -path=./utils/parser/2017/rawdata_kids.txt -patients=kids > ./utils/parser/2017/parsed_kids.json
```

Parsing data for adults
```
go run ./utils/parser/main.go -path=./utils/parser/2017/rawdata_adults.txt > ./utils/parser/2017/parsed_adults.json
```
