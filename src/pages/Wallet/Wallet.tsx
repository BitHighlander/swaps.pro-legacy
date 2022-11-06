import { Box, Flex, Spinner, Stack, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { Page } from 'components/Layout/Page'
import { UserWallet } from 'components/UserWallet/UserWallet';
import { useWallet } from "context/WalletProvider/WalletProvider";
import { Card } from "../../components/Card";

export const Wallet = () => {
    const { state } = useWallet()
    const { username } = state

    if (!username)
        return (
            <Box d='flex' width='full' justifyContent='center' alignItems='center'>
                <div>
                    <Page>
                        <Flex maxWidth={{ base: 'auto' }} mx='auto' px={16}>
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
            <UserWallet />
        </Page>
    )
}