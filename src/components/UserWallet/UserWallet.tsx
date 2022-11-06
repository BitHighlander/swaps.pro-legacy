
import { Card } from "../Card";
import {
    Box,
    Divider,
    Flex,
    Spinner,
    Stack,
    TabPanel,
    TabPanels,
    Tabs, VStack
} from "@chakra-ui/react";
import { useWallet } from "context/WalletProvider/WalletProvider";
import { Page } from "../Layout/Page";
import { BalancesChart } from "./BalancesChart";
import { BalancesList } from "./BalancesList";



export const UserWallet = () => {
    const { state, } = useWallet()

    if (!state.pioneer) return (
        <Box d='flex' width='full' justifyContent='center' alignItems='center'>
            <div>
                <Page>
                    <Flex maxWidth={{ base: 'auto'}} mx='auto' px={16}>
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
            <VStack justifyContent='center' alignItems='center'>
                <BalancesChart />
                <BalancesList />
            </VStack>
        </Card>
    )
}
