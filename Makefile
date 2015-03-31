default: clean build

clean:
	@rm -rf ./dist
	@rm -f dist.zip
	@mkdir -p {dist/img,dist/css,dist/js/lib}

build: ./dist
	@zip dist.zip -r ./dist

./dist: ./node_modules
	@npm run build

./node_modules: package.json
	@npm install
	@touch dist