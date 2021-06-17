-include Makefile.options
#####################################################################################
main_dir=mtapp
build_dir=build
APP_VERSION?=0.1
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

.PHONY:
	clean build
