mkdir -p pkg
rm -rf pkg/linksnip pkg/linksnip.zip
cd pkg
git clone ../../linksnip
rm -rf linksnip/.gitignore linksnip/.git linksnip/img/linksnip.svg linksnip/img/linksnip_ss.png linksnip/package.sh
find linksnip
zip -r linksnip.zip linksnip
