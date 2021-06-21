-include Makefile.options.local
-include Makefile.options
#####################################################################################
main_dir=mtapp
APP_VERSION?=0.1
dist_dir?=$(CURDIR)/deploy
build_dir=build
port?=8080
#####################################################################################
init: 
	cd $(main_dir) && $(MAKE) init
build-app: 
	cd $(main_dir) && $(MAKE) build	
test: 
	cd $(main_dir) && $(MAKE) test
#####################################################################################
dbuild: 
	cd $(build_dir) && $(MAKE) dbuild	
dpush: 
	cd $(build_dir) && $(MAKE) dpush
#####################################################################################
clean:
	cd $(main_dir) && $(MAKE) clean
	cd $(build_dir) && $(MAKE) clean
	rm -rf $(dist_dir)
#####################################################################################
serve-deployed:
	docker run -p $(port):80 -v $(dist_dir)/html:/usr/share/nginx/html nginx:1.17.9
#####################################################################################
dist_files=at css js info
files=$(dist_files) favicon.ico index.html
mtapp_files=$(patsubst %, $(dist_dir)/html/%, $(files))
mtapp_dist_files=$(patsubst %, $(dist_dir)/dist/%, $(dist_files))
$(dist_dir)/html:
	mkdir -p $@
$(dist_dir)/dist:
	mkdir -p $@
$(dist_dir)/html/%: mtapp/dist/% | $(dist_dir)/html
	cp -r $< $@
$(dist_dir)/html/favicon.ico: mtapp/dist/favicon.ico | $(dist_dir)/html
	cp $< $@
$(dist_dir)/html/index.html: public/index.html | $(dist_dir)/html
	cp $< $@		
$(dist_dir)/html/info: $(dist_dir)/html | $(dist_dir)/html
	echo version : $(version) > $@
	echo date    : $(shell date --rfc-3339=seconds) >> $@
$(dist_dir)/dist/%: $(dist_dir)/html/% | $(dist_dir)/dist
	cp -r $< $@
build: $(mtapp_files) 
pack: mtapp-component-$(version).tar.gz
mtapp-component-$(version).tar.gz: $(mtapp_dist_files) 
	tar -czf $@ -C $(dist_dir) dist
all:
	$(MAKE) clean init build-app && $(MAKE) build && $(MAKE) pack
#####################################################################################
put-component:
	scp mtapp-component-$(version).tar.gz $(component-share)

.PHONY:
	clean build
