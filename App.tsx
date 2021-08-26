import React, {useEffect, useMemo, useState} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {StyleSheet, Text, View} from 'react-native';
import {DataTable} from 'react-native-paper';
import {Table, Row, Rows} from 'react-native-table-component';
import {useLongPoll} from "./src/hooks/useLongPoll";
import {calcCurrencyValues} from "./src/utils/calcCurrensies";
import {findLowestValue} from "./src/utils/findLowestValue";

export type ActualCurrenciesType = {
    rates: RatesType
    timestamp: number
    base: string
    date: string
} | undefined
export type RatesType = {
    'RUB': number
    'USD': number
    'EUR': number
}
type drawTablePropsType = {
    index: number
    firstMarket: Array<number>
    secondMarket: Array<number>
    thirdMarket: Array<number>
    currency: string
}

const initial = [0, 0, 0, 0, 0, 0]
const creatorLongPollFetch = (market: string): () => Promise<ActualCurrenciesType> => {
    return async (): Promise<ActualCurrenciesType> => {
        let response = await fetch(`http://10.0.2.2:3000/api/v1/${market}/poll`)
        return await response.json()
    }
}
const creatorInitialFetch = (market: string): () => Promise<ActualCurrenciesType> => {
    return async (): Promise<ActualCurrenciesType> => {
        let response = await fetch(`http://10.0.2.2:3000/api/v1/${market}`)
        return await response.json()
    }
}
const useDataTransformer = (responseLongPoll: ActualCurrenciesType): Array<number> => {
    return useMemo(() => {
        if (responseLongPoll) {
            return calcCurrencyValues(responseLongPoll.rates)
        }
        return initial
    }, [responseLongPoll])
}

export default function App() {
    const headCells = ['first', 'second', 'third']
    const currencies = ['RUB/CUPCAKE', 'USD/CUPCAKE', 'EUR/CUPCAKE', 'RUB/USD', 'RUB/EUR', 'EUR/USD']

    const firstMarket = useLongPoll<ActualCurrenciesType>({
        fetchLongPoll: creatorLongPollFetch('first'),
        fetchInitialData: creatorInitialFetch('first'),
        isEnabled: true,
    })
    const secondMarket = useLongPoll<ActualCurrenciesType>({
        fetchLongPoll: creatorLongPollFetch('second'),
        fetchInitialData: creatorInitialFetch('second'),
        isEnabled: true,
    })
    const thirdMarket = useLongPoll<ActualCurrenciesType>({
        fetchLongPoll: creatorLongPollFetch('third'),
        fetchInitialData: creatorInitialFetch('third'),
        isEnabled: true,
    })

    const firstMarketHandledData = useDataTransformer(firstMarket.data)
    const secondMarketHandledData = useDataTransformer(secondMarket.data)
    const thirdMarketHandledData = useDataTransformer(thirdMarket.data)

    return (
        <View style={styles.container}>
            <PaperProvider>
                <DataTable style={styles.table}>
                    <DataTable.Header style={styles.row}>
                        <DataTable.Cell style={styles.emptyCell}> </DataTable.Cell>
                        {headCells.map((market) => <DataTable.Cell style={styles.headerCell} key={market}>
                            {market}
                        </DataTable.Cell>)}
                    </DataTable.Header>
                    {currencies.map((currency, index) => (
                        <DrawTable key={currency}
                                   index={index}
                                   currency={currency}
                                   firstMarket={firstMarketHandledData}
                                   secondMarket={secondMarketHandledData}
                                   thirdMarket={thirdMarketHandledData}
                        />
                    ))}
                </DataTable>
            </PaperProvider>
        </View>
    );
}

const DrawTable = ({index, currency, firstMarket, secondMarket, thirdMarket}: drawTablePropsType) => {
    const lowest: Array<number> = useMemo(() => {
        return findLowestValue(firstMarket, secondMarket, thirdMarket)
    }, [firstMarket, secondMarket, thirdMarket])
    return (
        <DataTable.Row style={styles.row}>
            <DataTable.Cell style={styles.currencyCell}>
                <Text style={styles.textCurrency}>{currency}</Text>
            </DataTable.Cell>
            <DataTable.Cell
                style={(firstMarket[index] === lowest[index] && lowest[index] !== 0) ? styles.activeCell : styles.passiveCell}
            >{firstMarket[index]}</DataTable.Cell>
            <DataTable.Cell
                style={(secondMarket[index] === lowest[index] && lowest[index] !== 0) ? styles.activeCell : styles.passiveCell}
            >{secondMarket[index]}</DataTable.Cell>
            <DataTable.Cell
                style={(thirdMarket[index] === lowest[index] && lowest[index] !== 0) ? styles.activeCell : styles.passiveCell}
            >{thirdMarket[index]}</DataTable.Cell>
        </DataTable.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF2F8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
    },
    table: {

    },
    row: {
        paddingHorizontal: 0,
        backgroundColor: 'blue',
    },
    text: {
        fontSize: 15,
    },
    textCurrency: {
        fontSize: 12,
    },
    emptyCell: {
        backgroundColor: 'darkgray',
        justifyContent: 'center',
        borderBottomWidth: 1,
    },
    currencyCell: {
        backgroundColor: 'white',
        paddingHorizontal: 5,
        justifyContent: "center",
    },
    headerCell: {
        backgroundColor: 'darkgray',
        justifyContent: 'center',
        borderBottomWidth: 1,
    },
    activeCell: {
        backgroundColor: '#cfe8fc',
        justifyContent: 'center',
    },
    passiveCell: {
        backgroundColor: 'white',
        justifyContent: 'center',
    }
});
