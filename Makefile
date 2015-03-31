default: clean build

clean:
	@rm -rf dist
	@rm -f dist.zip
	@mkdir dist
	@mkdir -p dist/img
	@mkdir -p dist/css
	@mkdir -p dist/js/lib

build: 
	@zip dist.zip -r dist