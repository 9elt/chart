export function join(first: string, second: string | number | undefined) {
    return second ? first + " " + second : first;
}
