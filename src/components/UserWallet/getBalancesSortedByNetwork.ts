import { Balance } from "context/WalletProvider/types";

export type BalancesSortedByNetwork = Array<{
    name: string,
    image: string,
    valueUsd: number,
    balanceCount: number,
    balances: Balance[]
}>

export const getBalancesSortedByNetwork = (balances: Balance[]) => {
    // const networks = ['bitcoin', 'ethereum', 'thorchain', 'bitcoincash', 'litecoin', 'binance', 'cosmos', 'dogecoin', 'osmosis']
    let sortedBalances: BalancesSortedByNetwork = []

    for (let index = 0; index < balances.length; index++) {
        const balance = balances[index];

        const sortedBalanceIdx = sortedBalances.findIndex((n) => n.name === balance.network)
        if (sortedBalanceIdx === -1) {
            sortedBalances.push({
                name: balance.network,
                image: `https://static.coincap.io/assets/icons/${balance.network}@2x.png`,
                valueUsd: Number(balance.valueUsd),
                balanceCount: 1,
                balances: [balance]
            })
            continue
        }
        sortedBalances[sortedBalanceIdx] = {
            name: balance.network,
            image: `https://static.coincap.io/assets/icons/${balance.network.toLowerCase()}@2x.png`,
            valueUsd: sortedBalances[sortedBalanceIdx].valueUsd += Number(balance.valueUsd),
            balanceCount: sortedBalances[sortedBalanceIdx].balanceCount += 1,
            balances: [...sortedBalances[sortedBalanceIdx].balances, balance]
        }

    }


    // for (let index = 0; index < networks.length; index++) {
    //     const network = networks[index];
    //     const networkBalances = balances.filter((b) => b.blockchain === network)
    //     let valueUsd = 0
    //     for (let i = 0; i < networkBalances.length; i++) {
    //         const balance = networkBalances[i];
    //         valueUsd += Number(balance.valueUsd)
    //     }
    //     sortedBalances.push({
    //         network,
    //         networkImage: `https://static.coincap.io/assets/icons/${network}@2x.png`,
    //         valueUsd,
    //         balanceCount: networkBalances.length,
    //         balances: networkBalances
    //     })
    // }
    console.log('sortedBalances', sortedBalances)
    return sortedBalances
}