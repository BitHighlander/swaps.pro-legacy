import {Box, Divider, Flex, Spinner, Stack, TabPanel, TabPanels, Tabs} from '@chakra-ui/react'
import { Page } from 'components/Layout/Page'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserActions } from './User/UserActions'
import { useWallet } from "context/WalletProvider/WalletProvider";
import {Card} from "../../components/Card";
import {Invocation} from "../../components/Invocation/Invocation";
// import { AssetBalance } from './AssetCards/AssetBalance'
// import { Rewards } from './AssetCards/Rewards'
// import { AssetDetails } from './AssetDetails/AssetDetails'
// import { AssetSidebar } from './AssetSidebar'

export interface MatchParams {
    network: string
    address: string
}

export const User = () => {
    const { state } = useWallet()
    const { username } = state


    // useEffect(() => {
    //     console.log("balances: ",balances)
    //     console.log("loading: ",loading)
    //     //console.log("username: ",username)
    // }, [balances, loading])

    if (!username)
        return (
            <Box d='flex' width='full' justifyContent='center' alignItems='center'>
                <div>
                    <Page>
                        <Flex maxWidth={{ base: 'auto', '2xl': '1464px' }} mx='auto' px={16}>
                            <Stack flex={1} spacing={4} justifyContent='center' alignItems='center'>
                                <Card maxW="460px" mx="auto" flex={1} justifyContent='center' alignItems='center'>
                                    <Tabs isFitted variant='soft-rounded' defaultIndex={0}>
                                        <TabPanels>
                                            <TabPanel>
                                                Connecting to Pioneer Server...
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
        <Page>
            <Flex maxWidth={{ base: 'auto', '2xl': '1464px' }} mx='auto' px={16}>
                <Stack flex={1} spacing={4} justifyContent='center' alignItems='center'>
                    <UserActions />
                </Stack>
            </Flex>
        </Page>
    )
}
