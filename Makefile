default: clean build

clean:
	@rm -rf dist
	@rm -f dist.zip
	@mkdir -p {dist/img,dist/css,dist/js/lib}

build: 
	@npm run build
	@zip dist.zip -r dist