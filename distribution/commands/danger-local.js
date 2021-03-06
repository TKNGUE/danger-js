#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var sharedDangerfileArgs_1 = require("./utils/sharedDangerfileArgs");
var runner_1 = require("./ci/runner");
var LocalGit_1 = require("../platforms/LocalGit");
var Fake_1 = require("../ci_source/providers/Fake");
program
    .usage("[options]")
    .option("-b, --base  [base]", "Choose the base commit to work against.")
    // TODO: this option
    // .option("-s, --staging", "Just use staged changes.")
    .description("Runs danger without PR metadata, useful for git hooks.");
sharedDangerfileArgs_1.default(program).parse(process.argv);
var app = program;
var base = app.base || "master";
var localPlatform = new LocalGit_1.LocalGit({ base: base, staged: app.staging });
localPlatform.validateThereAreChanges().then(function (changes) {
    if (changes) {
        var fakeSource = new Fake_1.FakeCI(process.env);
        runner_1.runRunner(app, { source: fakeSource, platform: localPlatform, additionalArgs: ["--local"] });
    }
    else {
        console.log("No git changes detected between head and master.");
    }
});
//# sourceMappingURL=danger-local.js.map