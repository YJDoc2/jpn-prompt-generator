#! /bin/bash

# This script is very specific to my usecase, so not much generic or anything

genkiGrammer

root=$(git rev-parse --show-toplevel)
cd root

rm -rf /tmp/gh-pages

git clone git@github.com:YJDoc2/jpn-prompt-generator.git --branch gh-pages /tmp/gh-pages 

cp -Lfr ./web //tmp/gh-pages
