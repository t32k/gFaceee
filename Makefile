default: clean build

clean:
	@rm -rf ./dist
	@rm -rf ./node_modules
	@rm -f dist.zip
	@mkdir -p {dist/img,dist/css,dist/js/lib}

build: ./dist
	@rm -rf ./dist/key.pem gFaceee.crx
	@npm run zip

./dist: ./node_modules
	@npm run build
	@touch ./dist

./node_modules: package.json
	@npm install
	@touch ./node_modules