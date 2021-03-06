"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var vm2_1 = require("vm2");
var fs = require("fs");
var transpiler_1 = require("./utils/transpiler");
var cleanDangerfile_1 = require("./utils/cleanDangerfile");
var resultsForCaughtError_1 = require("./utils/resultsForCaughtError");
// A WIP version of the runner which uses a vm2 based in-process runner, only used by self-hosted
// heroku instances of Peril.
//
// It very useful for testing in Danger JS though, because it's super tough to test the real inline runner.
// as it depends on a process ending.
//
function createDangerfileRuntimeEnvironment(dangerfileContext) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // This is for plugin support, we now have the Danger objects inside Danger's
            // main process context too. This means plugins that Danger depends on can also
            // get support for the globals.
            Object.keys(dangerfileContext).forEach(function (key) {
                global[key] = dangerfileContext[key];
            });
            return [2 /*return*/, {
                    require: {
                        external: true,
                        context: "host",
                        builtin: ["*"],
                    },
                    sandbox: __assign({}, dangerfileContext, { regeneratorRuntime: regeneratorRuntime || {} }),
                    compiler: transpiler_1.default,
                }];
        });
    });
}
exports.createDangerfileRuntimeEnvironment = createDangerfileRuntimeEnvironment;
exports.runDangerfileEnvironment = function (filenames, originalContents, environment, injectedObjectToExport) { return __awaiter(_this, void 0, void 0, function () {
    var _i, filenames_1, filename, index, originalContent, vm, content, optionalExport, results_1, error_1, isJest, errorResults, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, filenames_1 = filenames;
                _a.label = 1;
            case 1:
                if (!(_i < filenames_1.length)) return [3 /*break*/, 8];
                filename = filenames_1[_i];
                index = filenames.indexOf(filename);
                originalContent = (originalContents && originalContents[index]) || fs.readFileSync(filename, "utf8");
                vm = new vm2_1.NodeVM(environment);
                content = cleanDangerfile_1.default(originalContent);
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 7]);
                optionalExport = vm.run(content, filename);
                if (!(typeof optionalExport.default === "function")) return [3 /*break*/, 4];
                return [4 /*yield*/, optionalExport.default(injectedObjectToExport)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                results_1 = environment.sandbox.results;
                return [4 /*yield*/, Promise.all(results_1.scheduled.map(function (fnOrPromise) {
                        if (fnOrPromise instanceof Promise) {
                            return fnOrPromise;
                        }
                        if (fnOrPromise.length === 1) {
                            // callback-based function
                            return new Promise(function (res) { return fnOrPromise(res); });
                        }
                        return fnOrPromise();
                    }))];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                isJest = typeof jest !== "undefined";
                if (!isJest) {
                    console.error("Unable to evaluate the Dangerfile");
                }
                errorResults = resultsForCaughtError_1.default(filename, content, error_1);
                environment.sandbox.markdown(errorResults.markdowns[0].message);
                environment.sandbox.fail(errorResults.fails[0].message);
                return [3 /*break*/, 7];
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8:
                results = environment.sandbox.results;
                return [2 /*return*/, {
                        fails: results.fails,
                        warnings: results.warnings,
                        messages: results.messages,
                        markdowns: results.markdowns,
                    }];
        }
    });
}); };
var defaultExport = {
    createDangerfileRuntimeEnvironment: createDangerfileRuntimeEnvironment,
    runDangerfileEnvironment: exports.runDangerfileEnvironment,
};
exports.default = defaultExport;
//# sourceMappingURL=vm2.js.map