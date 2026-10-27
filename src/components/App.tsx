import { useState, useEffect } from 'react';

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildFormula(target: number, depth: number = 0): string {
    const maxDepth = randomInt(1, 3);

    if (depth >= maxDepth) {
        return String(target);
    }

    const op = ['+', '-', '*', '/'][randomInt(0, 3)];

    if (op === '+') {
        if (target <= 1) {
            return String(target);
        }

        const a = randomInt(1, target - 1);

        return `(${buildFormula(a, depth + 1)} + ${buildFormula(target - a, depth + 1)})`;
    }

    if (op === '-') {
        const a = randomInt(target + 1, target + 20);

        return `(${buildFormula(a, depth + 1)} - ${buildFormula(a - target, depth + 1)})`;
    }

    if (op === '*') {
        const divisors: number[] = [];

        for (let i = 1; i <= target; i++) {
            if (target % i === 0) {
                divisors.push(i);
            }
        }

        if (divisors.length <= 1) {
            return String(target);
        }

        const a = divisors[randomInt(1, divisors.length - 1)];

        return `(${buildFormula(a, depth + 1)} * ${buildFormula(target / a, depth + 1)})`;
    }

    const b = randomInt(1, 10);

    return `(${buildFormula(target * b, depth + 1)} / ${buildFormula(b, depth + 1)})`;
}


const calculateFormula = (formula: string): number => {
    return Function(`"use strict"; return (${formula})`)();
};

export default function App() {
    const [value, setValue] = useState<number>();
    const [formula, setFormula] = useState<string>('');
    const [formula2, setFormula2] = useState<string>('');
    const [formula3, setFormula3] = useState<string>('');
    const [operation, setOperation] = useState<string>('');
    const [goal, setGoal] = useState<number>();
    const [clicks, setClicks] = useState<number>(0);

    useEffect( () => {
        let nextValue = randomInt(1, 30);
        let currentGoal = randomInt(1, 100);

        while (currentGoal === nextValue){
            currentGoal = randomInt(1, 100);
            console.log("TEST!!!");
        }

        setValue(nextValue);
        setGoal(currentGoal);
        setFormula(buildFormula(nextValue));
        nextValue = randomInt(1, 30);
        setFormula2(buildFormula(nextValue));
        nextValue = randomInt(1, 30);
        setFormula3(buildFormula(nextValue));
        setOperation(currentGoal > nextValue ? 'add' : 'subtract');
    }, []);

    const fetchSent = (result: number, newClicks: number) => {
        fetch ("http://localhost:3001/api/game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                value:result,
                clicks:newClicks,
            }),
        });
    }

    const applyFormula = (formula: string) => {
        if (value === undefined || goal === undefined) return;

        const formulaValue = calculateFormula(formula);

        let result: number;

        switch (operation) {
            case 'add':
                result = value + formulaValue;
                break;

            case 'subtract':
                result = value - formulaValue;
                break;

            case 'multiply':
                result = value * formulaValue;
                break;

            case 'divide':
                result = value / formulaValue;
                break;

            default:
                return;
        }

        const newClicks = clicks + 1;
        setClicks(newClicks);

        setValue(result);

        if (result === goal) {
            alert(`You won in ${newClicks} clicks! (Refresh to restart)`);
            return;
        }

        fetchSent(result, newClicks);

        setOperation(goal > result ? 'add' : 'subtract');

        setFormula(buildFormula(randomInt(1, 30)));
        setFormula2(buildFormula(randomInt(1, 30)));
        setFormula3(buildFormula(randomInt(1, 30)));
    };

    return (
        <div className="container">
            <div className="tracker">
                <h2>Clicks:</h2>
                <div>{clicks}</div>
            </div>
            <div className="center">
                <div className="box">{value}</div>
                <div className="box">Goal: {goal}</div>
                <div className="text">{operation} by:</div>
                <button className="box2" onClick={() =>applyFormula(formula)}>
                    {formula}
                </button>
                <button className="box2" onClick={() =>applyFormula(formula2)}>
                    {formula2}
                </button>
                <button className="box2" onClick={() =>applyFormula(formula3)}>
                    {formula3}
                </button>
            </div>
        </div>
    );
}