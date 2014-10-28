bower = ./node_modules/.bin/bower

default: clean node_modules bower_components
	@mkdir package
	@mkdir -p package/lib
	@cp contents.css package
	@cp contents.js package
	@cp image-encoder.js package/lib
	@cp bower_components/jquery/dist/jquery.min.js package/lib
	@cp bower_components/underscore/underscore-min.js package/lib
	@cp *.png package
	@cp manifest.json package

clean:
	@rm -r package
	@rm -rf node_modules
	@rm -rf bower_components

node_modules: package.json
	@npm install
	@touch node_modules

bower_components: bower.json
	@$(bower) install
	@touch bower_components