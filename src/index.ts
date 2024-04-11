import { Vec2, X, Y } from "./vec";
import { join } from "./util";

const _CHUNK_ELEM_COUNT = 3;
const _LINE_ELEM_COUNT = 2;

export type SVGChartColumn = {
    value: number;
    className?: string;
};

export type SVGChartConfig = {
    height?: number;
    perspective?: number;
    radius?: number;
    columnWidth?: number;
    columnMargin?: number;
    maxValue?: number;
    lineThickness?: number;
};

export function svgChart(
    columns: SVGChartColumn[],
    config: SVGChartConfig = {}
): [SVGElement, () => void] {

    const nCol = columns.length;
    const nChunks = nCol * _CHUNK_ELEM_COUNT;
    const nLines = nCol * _LINE_ELEM_COUNT - 1;

    const children = new Array(nChunks + nLines);

    for (let i = 0; i < nCol; i++) {
        const ci = i * _CHUNK_ELEM_COUNT;
        const li = nChunks + i * _LINE_ELEM_COUNT;

        children[ci] = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        children[ci + 1] = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        children[ci + 2] = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

        children[li] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        if (i > 0) {
            children[li + 1] = document.createElementNS("http://www.w3.org/2000/svg", "line");
        }
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "chart");
    svg.setAttribute("x", "0px");
    svg.setAttribute("y", "0px");
    svg.append(...children);

    const update = () => {
        const maxH = config.height || 63;
        const perspective = config.perspective || 2;
        const radius = config.radius || 2;
        const w = config.columnWidth || 13;
        const mx = config.columnMargin || 2;
        const lineThickness = config.lineThickness || 2;

        const trueMaxH = maxH - perspective - radius / 2 - lineThickness;
        const viewBoxX = (w + (mx * 2)) * nCol + perspective;

        let maxValue = 0;

        if (config.maxValue) {
            maxValue = config.maxValue;
        }
        else {
            for (let i = 0; i < nCol; i++) {
                if (columns[i].value > maxValue) {
                    maxValue = columns[i].value;
                }
            }
        }

        let pp = new Vec2();

        for (let i = 0; i < nCol; i++) {
            const className = columns[i].className;

            const ci = i * _CHUNK_ELEM_COUNT;
            const li = nChunks + i * _LINE_ELEM_COUNT;

            const h = columns[i].value * trueMaxH / maxValue;
            const x = mx + i * (w + mx);
            const mt = maxH - h;

            const front = children[ci];
            front.setAttribute("class", join("front", className));
            front.setAttribute("x", x);
            front.setAttribute("y", mt);
            front.setAttribute("width", w);
            front.setAttribute("height", h);

            const side = children[ci + 1];
            side.setAttribute("class", join("side", className));
            side.setAttribute("points",
                (x + w) + "," + mt + " " +
                (x + w + perspective) + "," + (mt - perspective) + " " +
                (x + w + perspective) + "," + (maxH - perspective) + " " +
                (x + w) + "," + maxH
            );

            const top = children[ci + 2];
            top.setAttribute("class", join("top", className));
            top.setAttribute("points",
                x + "," + mt + " " +
                (x + perspective) + "," + (mt - perspective) + " " +
                (x + w + perspective) + "," + (mt - perspective) + " " +
                (x + w) + "," + mt
            );

            // center
            const p = new Vec2(x + (w + mx) / 2, mt - perspective / 2);

            // line vector
            const v = new Vec2(p[X] - pp[X], p[Y] - pp[Y]);
            const vl = Math.sqrt(v[X] ** 2 + v[Y] ** 2);

            // normalized vector
            const u = new Vec2(v[X] / vl, v[Y] / vl);

            const start = new Vec2(p[X] - u[X] * radius, p[Y] - u[Y] * radius);
            const end = new Vec2(pp[X] + u[X] * radius, pp[Y] + u[Y] * radius);

            const circle = children[li];
            circle.setAttribute("class", join("line", className));
            circle.setAttribute("cx", p[X]);
            circle.setAttribute("cy", p[Y]);
            circle.setAttribute("r", radius);

            if (i > 0) {
                const line = children[li + 1];
                line.setAttribute("class", join("line", className));
                line.setAttribute("x1", start[X]);
                line.setAttribute("y1", start[Y]);
                line.setAttribute("x2", end[X]);
                line.setAttribute("y2", end[Y]);
            }

            pp = p;
        }

        svg.setAttribute("viewBox", "0 0 " + viewBoxX + " " + maxH);
    };

    update();

    return [svg, update];
}
