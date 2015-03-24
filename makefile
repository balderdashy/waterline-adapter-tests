# SHELL:=/bin/bash
POSTGRES=$(shell node test/integration/runner.js sails-postgresql)

test: test-integration

test-integration:
	@echo "test results"
	@echo "$(POSTGRES)"
	
	