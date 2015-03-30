default: clean build

clean:
	@rm -rf package
	@rm -rf node_modules
	@rm -f package.zip
	@mkdir package
	@mkdir -p package/img
	@mkdir -p package/css
	@mkdir -p package/js/dist
	@mkdir -p package/js/lib

build: node_modules
	@cp src/css/contents.css package/css
	@cp src/js/dist/contents.js package/js/dist
	@cp src/js/lib/image-encoder.js package/js/lib
	@cp src/js/lib/fetch.js package/js/lib
	@cp src/img/*.png package/img
	@cp src/manifest.json package
	@zip package.zip -r package

node_modules: package.json
	@npm install
	@touch node_modules