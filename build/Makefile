-include ../Makefile.options
#####################################################################################
dist_dir=$(CURDIR)/deploy
main_dir=../mtapp
service=music-transcription-app
version=$(APP_VERSION)
commit_count=$(shell git rev-list --count HEAD)
#####################################################################################
$(dist_dir):
	mkdir -p $(dist_dir)

$(dist_dir)/.build: $(main_dir) 
	cd $(main_dir) && npm run build -- --dest=$(dist_dir)/html
	touch $@

build: $(dist_dir)/.build
########### DOCKER ##################################################################
tag=$(USER)/$(service):$(version).$(commit_count)

dbuild: build
	docker build -t $(tag) ./

dpush: dbuild
	docker push $(tag)
	@echo -n "\nCONTAINER: $(tag)\n\n"
########### END #####################################################################
#####################################################################################
clean:
	rm -rf $(dist_dir)

.PHONY:
	clean dbuild dpush build
