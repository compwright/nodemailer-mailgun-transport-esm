lint:
	node_modules/.bin/semistandard --fix ./src

test: lint
	NODE_OPTIONS="--experimental-vm-modules" node_modules/.bin/jest test/*.test.js

release: test
	node_modules/.bin/standard-version
