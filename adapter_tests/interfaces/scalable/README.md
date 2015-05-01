# Benchmarks

Currently, the goal with the `scalable` interface is to test that a reasonable bar for performance/memory usage is met, for the `semantic` (CRUD) and `queryable` (searching using criteria) interfaces.

We're standardizing to “Benchmark.js](https://github.com/bestiejs/benchmark.js) across all the sails/waterline projects.


###### Writing good benchmarks
+ Pick what you want to test.
+ Whatever you choose does not have to be atomic (see examples above)-- in an ideal world, we would have benchmarks for every single function in our apps, but that is not how things work today.
+ Write a benchmark test that isolates that functionality. (the hard part)
+ Then see how many miliseconds it takes. (easy)

> **Advice from Felix Geisendörfer ([@felixge](https://github.com/felixge))**
>
>	+ First of all, keep in mind our problems are definitely not the same as Felix's, and we must remember to follow [his own advice](https://github.com/felixge/faster-than-c#taking-performance-advice-from-strangers): `[What]...does not work is taking performance advise (euro-sic) from strangers...`  That said, he's got some great ideas.
>	+ [Benchmark-Driven Optimization](https://github.com/felixge/faster-than-c#benchmark-driven-development)
>	+ I also highly recommend this [talk on optimization and benchmarking](http://2012.jsconf.eu/speaker/2012/09/05/faster-than-c-parsing-node-js-streams-.html) ([slides](https://github.com/felixge/faster-than-c)).

