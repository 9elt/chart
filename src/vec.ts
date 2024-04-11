export const X = 0;
export const Y = 1;

export class Vec2 extends Float64Array {
    constructor(x = 0, y = 0) {
        super(2);
        this[X] = x;
        this[Y] = y;
    }
}
