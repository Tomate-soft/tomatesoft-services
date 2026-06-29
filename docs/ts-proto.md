# Commando para generar los tipos de TS a partir de los archivos ".proto"

``` bash
pnpx protoc --ts_proto_out=./types/ ./proto/*.proto --ts_proto_opt=nestJs=true

```