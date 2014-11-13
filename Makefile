bower = ./node_modules/.bin/bower

default: clean node_modules bower_components
	@mkdir package
	@mkdir -p package/img
	@mkdir -p package/css
	@mkdir -p package/js/lib
	@cp src/css/contents.css package/css
	@cp src/js/contents.js package/js
	@cp src/js/lib/image-encoder.js package/js/lib
	@cp bower_components/jquery/dist/jquery.min.js package/js/lib
	@cp bower_components/underscore/underscore-min.js package/js/lib
	@cp src/img/*.png package/img
	@cp src/manifest.json package
	@zip package.zip -r package

clean:
	@rm -rf package
	@rm -rf node_modules
	@rm -rf bower_components
	@rm -f package.zip

node_modules: package.json
	@npm install
	@touch node_modules

bower_components: bower.json
	@$(bower) install
	@touch bower_components