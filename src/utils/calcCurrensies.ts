import {RatesType} from "../../App";


export const calcCurrencyValues = (rates: RatesType): Array<number> => {
    const currentCurrencyValues: Array<number> = []
    currentCurrencyValues.push(+(1 / rates.RUB).toFixed(3))
    currentCurrencyValues.push(+(1 / rates.USD).toFixed(3))
    currentCurrencyValues.push(+(1 / rates.EUR).toFixed(3))
    currentCurrencyValues.push(+(rates.USD / rates.RUB).toFixed(3))
    currentCurrencyValues.push(+(rates.EUR / rates.RUB).toFixed(3))
    currentCurrencyValues.push(+(rates.USD / rates.EUR).toFixed(3))
    return currentCurrencyValues
}
