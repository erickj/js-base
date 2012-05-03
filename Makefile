DATE=$(shell date +%I:%M%p)
CHECK=\033[32m✔\033[39m
HR=\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#

all:
	cat src/ext.js src/base.js src/util.js > js_base.js
	uglifyjs -nc js_base.js > js_base.min.js

clean:
	rm -f js_base.min.js js_base.js