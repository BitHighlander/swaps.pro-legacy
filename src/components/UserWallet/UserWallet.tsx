
import { Card } from "../Card";
import {
    Box,
    Button,
    Divider,
    Flex,
    Spinner,
    Stack,
    TabPanel,
    TabPanels,
    Tabs, VStack,
    Select
} from "@chakra-ui/react";
import { useWallet } from "context/WalletProvider/WalletProvider";
import { Page } from "../Layout/Page";
import { BalancesChart } from "./BalancesChart";
import { BalancesList } from "./BalancesList";
import { useEffect, useState } from "react";
import { TbSwitchVertical } from 'react-icons/tb'
import { Balance } from "context/WalletProvider/types";
import { BalancesSortedByNetwork, getBalancesSortedByNetwork } from "./getBalancesSortedByNetwork";


export const UserWallet = () => {
    const { state } = useWallet()

    const [balanceNetwork, setBalanceNetwork] = useState('all')
    const [bals, setBals] = useState<Balance[]>()
    const [sortedBals, setSortedBals] = useState<BalancesSortedByNetwork>()

    useEffect(() => {
        if (!state.balances) return
        setSortedBals(getBalancesSortedByNetwork(state.balances))
    }, [state.balances])

    useEffect(() => {
        if (!sortedBals || !state.balances) return
        if (balanceNetwork !== 'all') {
            const newBals = sortedBals.find((n) => n.name === balanceNetwork)
            if (newBals) setBals(newBals.balances)
        } else {
            setBals(state.balances)
        }
    }, [balanceNetwork, sortedBals, state.balances])

    if (!state.pioneer) return (
        <Box d='flex' width='full' justifyContent='center' alignItems='center'>
            <div>
                <Page>
                    <Flex maxWidth={{ base: 'auto' }} mx='auto' px={16}>
                        <Stack flex={1} spacing={4} justifyContent='center' alignItems='center'>
                            <Card maxW="460px" mx="auto" flex={1} justifyContent='center' alignItems='center'>
                                <Tabs isFitted variant='soft-rounded' defaultIndex={0}>
                                    <TabPanels>
                                        <TabPanel>
                                            loading user...
                                            <Spinner
                                                thickness="4px"
                                                speed="0.65s"
                                                emptyColor="gray.200"
                                                color="blue.500"
                                                size="xl"
                                            />
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Card>
                        </Stack>
                    </Flex>
                </Page>
            </div>
        </Box>
    )
    return (
        <Card mx="auto" justifyContent='center' alignItems='center' >
            <Card.Header px={0} pt={2}>
                <Card.Heading textAlign='center'>Wallet</Card.Heading>
            </Card.Header>
            <Divider />
            <VStack justifyContent='center' alignItems='end' px={20} pt={5}>
                <Select width='fit-content' defaultValue='all' value={balanceNetwork} onChange={(e) => {
                    setBalanceNetwork(e.target.value)
                }}>
                    <option value='all'>All Networks</option>
                    {sortedBals && sortedBals.map((n) => <option value={n.name}>{n.name} Network</option>)}
                </Select>
            </VStack>
            <VStack justifyContent='center' alignItems='center'>
                {bals && <BalancesChart balances={bals} />}
                {bals && <BalancesList balances={bals} />}
            </VStack>
        </Card >
    )
}
