
test: test-integration

test-integration:
	@echo "\nRunning API integration tests against the official adapters"
	chmod +x test/integration/runner.sh
	test/integration/runner.sh
	@echo "\n all done"

test-load:
	@echo "\nRunning load tests..."
	@NODE_ENV=test node test/load
