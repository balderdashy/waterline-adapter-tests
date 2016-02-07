Integration tests
==========================
[![Build Status](https://travis-ci.org/balderdashy/waterline-adapter-tests.svg?branch=master)](https://travis-ci.org/balderdashy/waterline-adapter-tests)

A set of integration tests that test the official adapters against waterline core edge version: [example](https://travis-ci.org/balderdashy/waterline-adapter-tests/jobs/56168135#L1326).


## Goals

 * Detect if a change in waterline core breaks the API;
 * Detect if a change in waterline-adapter-tests breaks any official adapter tests;
 * Test using the edge versions of waterline core, waterline-adapter-tests and the adapters to ensure the current snapshot of all these are working together and consequently are OK to release;
 * make it easier for waterline core developers to test changes against all official adapters (it's not fun to setup all these dbs and run tests 6 times).


## What's the difference between these tests and the ones ran by the individual adapters?

The adapters are configured to run their tests against the **stable** versions of waterline core and waterline-adapter-tests. From an adapter point of view, this makes sense since the adapter is only responsible for supporting the stable versions of its dependencies. These tests run against waterline core **edge** version (latest in github) and the objective is to prevent changes in waterline core from accidentally breaking the adapters.


## Why not have these tests ran in waterline core builds?

These tests will likely break more often as they are dependent on the adapters themselves so there is a risk for false positives and we don't want to add noise to the waterline core builds. Still, a subset of these adapter tests has been added to waterline ([PR #896](https://github.com/balderdashy/waterline/pull/896)). It only tests waterline core against sails-memory and it constitutes a *canary test* to detect API breaks.


For more details check the following PRs: [#36](https://github.com/balderdashy/waterline-adapter-tests/pull/36), [#39](https://github.com/balderdashy/waterline-adapter-tests/pull/39).
