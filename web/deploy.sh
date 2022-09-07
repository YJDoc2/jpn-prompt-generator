#! /bin/bash

# This script is very specific to my usecase, so not much generic or anything

genkiGrammer

root=$(git rev-parse --show-toplevel)
cd root

git clone github

cp -Lfr ./web /tmp/
