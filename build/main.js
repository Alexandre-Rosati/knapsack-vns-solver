"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.max_weight = exports.neighborhood_mode = exports.items = exports.complete_log = void 0;
const utils_1 = require("./utils");
const perf_hooks_1 = require("perf_hooks");
// debugger
exports.complete_log = false;
exports.items = [
    new utils_1.Item('A', 3, 4),
    new utils_1.Item('B', 1, 2),
    new utils_1.Item('C', 6, 7),
    new utils_1.Item('D', 4, 3),
    new utils_1.Item('E', 5, 4)
];
// neighborhood_mode 1 = invert bit
// neighborhood_mode 0 = swap item
exports.neighborhood_mode = 1;
exports.max_weight = 12;
const k_max = 3;
const stuck_max = 100;
const initialSolution = [0, 0, 0, 0, 0];
for (let i = 0; i < 1; i++) {
    const startTimerLS = perf_hooks_1.performance.now();
    const solution1 = utils_1.localSearch(initialSolution);
    const endTimerLS = perf_hooks_1.performance.now();
    console.log("== LOCAL SEARCH ==");
    console.log("initial solution : ", initialSolution);
    console.log("final solution : ", solution1);
    console.log("converted final solution : ", utils_1.convertSolution(solution1));
    console.log("value of final solution : ", utils_1.calculate(solution1));
    console.log("duration in ms : ", (endTimerLS - startTimerLS));
    console.log("== VARIABLE NEIGHBORDHOOD SEARCH ==");
    const startTimerVNS = perf_hooks_1.performance.now();
    const solution2 = VNS(solution1, k_max, stuck_max);
    const endTimerVNS = perf_hooks_1.performance.now();
    console.log("initial solution : ", solution1);
    console.log("k max : ", k_max);
    console.log("iteration max : ", stuck_max);
    console.log("final solution : ", solution2);
    console.log("converted final solution : ", utils_1.convertSolution(solution2));
    console.log("value of final solution : ", utils_1.calculate(solution2));
    console.log("duration in ms : ", (endTimerVNS - startTimerVNS));
}
function VNS(initialSolution, k_max, stuck_max) {
    let solution = [...initialSolution];
    let k = 1;
    let stuck = 0;
    while (stuck < stuck_max) {
        const perturbationSolution = utils_1.perturbation(solution, k);
        const localSearchSolution = utils_1.localSearch(perturbationSolution);
        if (utils_1.solutionIsBetter(solution, localSearchSolution)) {
            solution = [...localSearchSolution];
            k = 1;
        }
        else {
            k = k >= k_max ? k = 1 : ++k;
            stuck++;
        }
    }
    return solution;
}
