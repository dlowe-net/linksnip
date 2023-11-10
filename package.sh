#!/bin/sh

rm -rf pkg
mkdir -p pkg
cd pkg
git clone ../../linksnip
rm -rf linksnip/.gitignore linksnip/.git linksnip/.github linksnip/spec linksnip/img/linksnip.svg linksnip/img/linksnip_ss.png linksnip/package.sh linksnip/test.html
mv linksnip/manifest_$1.json linksnip/manifest.json
find linksnip
cd linksnip
zip -r ../linksnip-$2.zip .
