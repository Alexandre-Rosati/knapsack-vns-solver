"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localSearch = exports.solutionIsBetter = exports.generateNeighborhood = exports.swapItem = exports.invertBit = exports.perturbation = exports.convertSolution = exports.calculate = exports.Item = void 0;
const main_1 = require("./main");
class Item {
    constructor(name, value, weight) {
        this.name = name;
        this.value = value;
        this.weight = weight;
    }
}
exports.Item = Item;
function calculate(S) {
    let value = 0;
    let weight = 0;
    main_1.items.forEach(function (item, i) {
        if (S[i] == 1) {
            value += item.value;
            weight += item.weight;
        }
    });
    return { weight: weight, value: value };
}
exports.calculate = calculate;
function convertSolution(S) {
    let output = '';
    S.forEach(function (bit, i) {
        if (bit) {
            output += output.length > 0 ? ' + ' : '';
            output += main_1.items[i].name;
        }
    });
    return output;
}
exports.convertSolution = convertSolution;
function perturbation(S, k) {
    if (main_1.complete_log) {
        console.log("=== start perturbation from :", S);
    }
    let solution = [...S];
    for (let i = 0; i < k; i++) {
        if (main_1.complete_log)
            console.log("k : ", i + 1);
        const neighborhood = generateNeighborhood(solution);
        const random = Math.floor(Math.random() * neighborhood.length);
        solution = neighborhood[random];
        if (main_1.complete_log) {
            console.log("random :", random + 1);
            console.log("solution :", solution);
        }
    }
    if (main_1.complete_log) {
        console.log("=== stop perturbation");
    }
    return solution;
}
exports.perturbation = perturbation;
function invertBit(S) {
    let V = [];
    let totalOfNeighbordhood = 0;
    for (let i = 0; i < S.length; i++) {
        totalOfNeighbordhood++;
        let v = [...S];
        v[i] = v[i] ? 0 : 1;
        V.push(v);
        if (main_1.complete_log)
            console.log("s" + (totalOfNeighbordhood), v);
    }
    return V;
}
exports.invertBit = invertBit;
function swapItem(S) {
    let V = [];
    let totalOfNeighbordhood = 0;
    for (let i = 0; i < S.length; i++) {
        for (let j = 0; j < S.length; j++) {
            if (S[i] != S[j]) {
                let v = [...S];
                v[i] = v[i] ? 0 : 1;
                v[j] = v[j] ? 0 : 1;
                let already = false;
                V.forEach(function (value) {
                    if (JSON.stringify(value) == JSON.stringify(v))
                        already = true;
                });
                if (!already) {
                    totalOfNeighbordhood++;
                    V.push(v);
                    if (main_1.complete_log)
                        console.log("s" + (totalOfNeighbordhood), v);
                }
            }
        }
    }
    return V;
}
exports.swapItem = swapItem;
function generateNeighborhood(S) {
    let V = [];
    if (main_1.complete_log)
        console.log("generate neighborhood of :", S);
    V = main_1.neighborhood_mode ? invertBit(S) : swapItem(S);
    return V;
}
exports.generateNeighborhood = generateNeighborhood;
function solutionIsBetter(oldSolution, newSolution) {
    if ((calculate(newSolution).value > calculate(oldSolution).value ||
        (calculate(newSolution).value == calculate(oldSolution).value
            && calculate(newSolution).weight > calculate(oldSolution).weight))
        && calculate(newSolution).weight <= main_1.max_weight) {
        return true;
    }
    else {
        return false;
    }
}
exports.solutionIsBetter = solutionIsBetter;
function localSearch(S) {
    if (main_1.complete_log) {
        console.log("=== start local search from :", S);
    }
    let solution = [...S];
    let stop = false;
    while (stop === false) {
        let bestSolution = [...solution];
        generateNeighborhood(bestSolution).forEach(function (s) {
            if (solutionIsBetter(bestSolution, s)) {
                bestSolution = [...s];
            }
        });
        if (JSON.stringify(solution) == JSON.stringify(bestSolution)) {
            stop = true;
            if (main_1.complete_log)
                console.log("no solution is upgraded  : stop local search");
        }
        else {
            solution = [...bestSolution];
            if (main_1.complete_log)
                console.log("upgrade :", solution);
        }
    }
    if (main_1.complete_log) {
        console.log("solution : " + convertSolution(solution), solution);
        console.log("value", calculate(solution));
        console.log("=== stop local search");
    }
    return solution;
}
exports.localSearch = localSearch;
