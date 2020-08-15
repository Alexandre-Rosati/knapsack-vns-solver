import { Item, localSearch, convertSolution, perturbation, solutionIsBetter, calculate } from './utils';
import { performance } from 'perf_hooks';

// debugger
export const complete_log = false;

export const items: Array<Item> = [
    new Item('A', 3, 4),
    new Item('B', 1, 2),
    new Item('C', 6, 7),
    new Item('D', 4, 3),
    new Item('E', 5, 4)
];

// neighborhood_mode 1 = invert bit
// neighborhood_mode 0 = swap item
export const neighborhood_mode = 1;
export const max_weight: number = 12;

const k_max: number = 3;
const stuck_max: number = 100;

const initialSolution: number[] = [0, 0, 0, 0, 0];

for (let i = 0; i < 1; i++) {
    const startTimerLS = performance.now();
    const solution1 = localSearch(initialSolution);
    const endTimerLS = performance.now();
    console.log("== LOCAL SEARCH ==");
    console.log("initial solution : ", initialSolution);
    console.log("final solution : ", solution1);
    console.log("converted final solution : ", convertSolution(solution1));
    console.log("value of final solution : ", calculate(solution1));
    console.log("duration in ms : ", (endTimerLS - startTimerLS));

    console.log("== VARIABLE NEIGHBORDHOOD SEARCH ==");
    const startTimerVNS = performance.now();
    const solution2 = VNS(solution1, k_max, stuck_max);
    const endTimerVNS = performance.now();
    console.log("initial solution : ", solution1);
    console.log("k max : ", k_max);
    console.log("iteration max : ", stuck_max);
    console.log("final solution : ", solution2);
    console.log("converted final solution : ", convertSolution(solution2));
    console.log("value of final solution : ", calculate(solution2));
    console.log("duration in ms : ", (endTimerVNS - startTimerVNS));
}

function VNS(initialSolution: number[], k_max: number, stuck_max: number): number[] {
    let solution = [...initialSolution];
    let k = 1;
    let stuck = 0;
    while (stuck < stuck_max) {
        const perturbationSolution = perturbation(solution, k);
        const localSearchSolution = localSearch(perturbationSolution);
        if (solutionIsBetter(solution, localSearchSolution)) {
            solution = [...localSearchSolution];
            k = 1;
        } else {
            k = k >= k_max ? k = 1 : ++k;
            stuck++;
        }
    }
    return solution;
}