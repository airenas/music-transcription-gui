#############################################################################
-include ../Makefile.options
deploy_dir?=dist
#############################################################################
.init.done: public/at/LICENSE.alphaTab public/at/alphaTab.min.js public/at/font \
	public/at/soundfont updateVersion
	touch $@

updateVersion: makeVersionFile
	rsync --checksum src/service/version.js_ src/service/version.js

makeVersionFile: 
	cat src/service/version.js.in | envsubst > src/service/version.js_

public/at/alphaTab.min.js: node_modules/@coderline/alphatab/dist/alphaTab.min.js 
	cp $< $@
public/at/LICENSE.alphaTab: node_modules/@coderline/alphatab/LICENSE
	cp $< $@	
public/at/%: node_modules/@coderline/alphatab/dist/% 
	cp -r $< $@

build: .init.done
	npm run build
test: .init.done 
	npm run test:unit
#############################################################################
serve: .init.done updateVersion
	npm run serve
init:
	npm ci
	$(MAKE) .init.done
#############################################################################
clean-deploy: 
	rm -rf $(deploy_dir)/at $(deploy_dir)/css $(deploy_dir)/js
	rm -f $(deploy_dir)/index.html $(deploy_dir)/favicon.icoma
	rm -f .init.done
#############################################################################
clean: 
	rm -rf dist
	rm -rf node_modules

.EXPORT_ALL_VARIABLES:	
