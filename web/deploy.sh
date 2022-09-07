#! /bin/bash

# This script is very specific to my usecase, so not much generic or anything

root=$(git rev-parse --show-toplevel)
shortSha=$(git rev-parse --short HEAD)

cd $root

rm -rf /tmp/gh-pages

git clone git@github.com:YJDoc2/jpn-prompt-generator.git --branch gh-pages /tmp/gh-pages 

rm -rf /tmp/gh-pages/*

cp -Lfr ./web/* /tmp/gh-pages

cd /tmp/gh-pages

git add .

git commit -m "corresponding to $shortSha"

git push origin gh-pages