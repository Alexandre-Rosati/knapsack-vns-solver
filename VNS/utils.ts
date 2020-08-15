import { items, max_weight, neighborhood_mode, complete_log } from './main'

export class Item {
    name: string;
    value: number;
    weight: number;
    constructor(name: string, value: number, weight: number) {
        this.name = name;
        this.value = value;
        this.weight = weight;
    }
}

export function calculate(S: number[]) {
    let value: number = 0;
    let weight: number = 0;
    items.forEach(function (item, i) {
        if (S[i] == 1) {
            value += item.value;
            weight += item.weight;
        }
    });
    return { weight: weight, value: value };
}

export function convertSolution(S: number[]): string {
    let output = '';
    S.forEach(function (bit, i) {
        if (bit) {
            output += output.length > 0 ? ' + ' : '';
            output += items[i].name;

        }
    });
    return output;
}


export function perturbation(S: number[], k: number) {
    if (complete_log) {
        console.log("=== start perturbation from :", S);
    }
    let solution = [...S];
    for (let i = 0; i < k; i++) {
        if (complete_log) console.log("k : ", i + 1);
        const neighborhood = generateNeighborhood(solution);
        const random = Math.floor(Math.random() * neighborhood.length);
        solution = neighborhood[random];
        if (complete_log) {
            console.log("random :", random + 1);
            console.log("solution :", solution);
        }
    }
    if (complete_log) {
        console.log("=== stop perturbation");
    }
    return solution;
}

export function invertBit(S: number[]): Array<number[]> {
    let V: Array<number[]> = [];
    let totalOfNeighbordhood = 0;
    for (let i = 0; i < S.length; i++) {
        totalOfNeighbordhood++;
        let v: number[] = [...S];
        v[i] = v[i] ? 0 : 1;
        V.push(v);
        if (complete_log) console.log("s" + (totalOfNeighbordhood), v);
    }
    return V;
}

export function swapItem(S: number[]): Array<number[]> {
    let V: Array<number[]> = [];
    let totalOfNeighbordhood = 0;
    for (let i = 0; i < S.length; i++) {
        for (let j = 0; j < S.length; j++) {
            if (S[i] != S[j]) {
                let v: number[] = [...S];
                v[i] = v[i] ? 0 : 1;
                v[j] = v[j] ? 0 : 1;
                let already = false;
                V.forEach(function (value) {
                    if (JSON.stringify(value) == JSON.stringify(v)) already = true;
                });
                if (!already) {
                    totalOfNeighbordhood++;
                    V.push(v);
                    if (complete_log) console.log("s" + (totalOfNeighbordhood), v);
                }
            }
        }
    }
    return V;
}

export function generateNeighborhood(S: number[]): Array<number[]> {
    let V: Array<number[]> = [];
    if (complete_log) console.log("generate neighborhood of :", S);
    V = neighborhood_mode ? invertBit(S) : swapItem(S);
    return V;
}

export function solutionIsBetter(oldSolution: number[], newSolution: number[]): boolean {
    if ((calculate(newSolution).value > calculate(oldSolution).value ||
        (calculate(newSolution).value == calculate(oldSolution).value
            && calculate(newSolution).weight > calculate(oldSolution).weight))
        && calculate(newSolution).weight <= max_weight) {

        return true;
    } else {
        return false;
    }
}

export function localSearch(S: number[]): number[] {
    if (complete_log) {
        console.log("=== start local search from :", S);
    }
    let solution: number[] = [...S];
    let stop: boolean = false;
    while (stop === false) {
        let bestSolution = [...solution];
        generateNeighborhood(bestSolution).forEach(function (s) {
            if (solutionIsBetter(bestSolution, s)) {
                bestSolution = [...s];
            }
        });
        if (JSON.stringify(solution) == JSON.stringify(bestSolution)) {
            stop = true;
            if (complete_log) console.log("no solution is upgraded  : stop local search");
        } else {
            solution = [...bestSolution];
            if (complete_log) console.log("upgrade :", solution);
        }
    }
    if (complete_log) {
        console.log("solution : " + convertSolution(solution), solution);
        console.log("value", calculate(solution));
        console.log("=== stop local search");
    }
    return solution;
}