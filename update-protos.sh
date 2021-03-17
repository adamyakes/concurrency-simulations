#!/usr/bin/env bash

protoc css.proto --js_out=import_style=commonjs:angular/src/app --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:angular/src/app

GO111MODULE=on protoc --go_opt=paths=source_relative --go_out=plugins=grpc:go/css css.proto
