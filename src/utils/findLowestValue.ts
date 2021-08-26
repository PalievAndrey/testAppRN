export function findLowestValue (first: Array<number>, second: Array<number>, third: Array<number>): Array<number> {
    let lowest: Array<number> = [0, 0, 0, 0, 0, 0]
    return lowest.map((val, ind) => {
        return Math.min(first[ind], second[ind], third[ind])
    })
}
