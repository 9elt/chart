import { svgChart } from "../src";

const columns = [
    { value: 0, className: "yellow", max: 55 },
    { value: 0, className: "blue", max: 99 },
    { value: 0, className: "orange", max: 14 },
    { value: 0, className: "yellow", max: 44 },
    { value: 0, className: "yellow", max: 44 },
];

const config = {
    height: 64,
    perspective: 1,
    radius: 4,
    columnWidth: 14,
    columnMargin: 2,
    maxValue: 100,
};

const [svg, update] = svgChart(columns, config);

document.body.prepend(svg);

let pending = 0b11111;

const loop = () => {
    for (let i = 0; i < columns.length; i++) {
        const c = 1 << i;

        if (pending & c) {
            const value = columns[i].value;
            const max = columns[i].max;

            columns[i].value = value + (max - value) / 20;

            if (columns[i].value >= max - 0.01) {
                columns[i].value = max;
                pending ^= c;
            }
        }

        config.perspective = 1 + (columns[0].value / columns[0].max) * 3;
    }

    update();

    if (pending)
        requestAnimationFrame(loop);
}

loop();
