import { Button, HStack, Image, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, VStack } from "@chakra-ui/react"
import { Balance } from "context/WalletProvider/types"
import { useModal } from "hooks/useModal/useModal"
import { FC } from "react"
import { FiDownload, FiUpload } from "react-icons/fi"

export const BalancesList: FC<{ balances: Balance[] }> = ({ balances }) => {
    const { sendAsset, receiveAsset } = useModal()

    return (
        <TableContainer >
            <Table variant='simple' >
                <Thead bgColor="gray.600">
                    <Tr>
                        <Th>Coin</Th>
                        <Th isNumeric>Available Amount</Th>
                        <Th isNumeric>Value (USD)</Th>
                        <Th isNumeric px={8}>Send</Th>
                        <Th isNumeric px={8}>Receive</Th>
                    </Tr>
                </Thead>
                <Tbody overflow="scroll">
                    {balances && balances.sort((a, b) => Number(b.valueUsd) - Number(a.valueUsd)).map((bal) => <Tr>
                        <Td>
                            <HStack>
                                <Image src={bal.image} maxW="35px" />
                                <VStack justifyContent='left' alignItems='left'>
                                    <Text>{bal.symbol}</Text>
                                    {bal.name && <Text opacity="70%">{bal.name}</Text>}
                                </VStack>
                            </HStack>
                        </Td>
                        <Td isNumeric>{bal.balance}</Td>
                        <Td isNumeric>{bal.valueUsd}</Td>
                        <Td isNumeric>
                            <Button
                                bgColor='red.200'
                                color='red.800'
                                _hover={{
                                    color: 'red.700',
                                    bgColor: 'red.100'
                                }}
                                onClick={() => { sendAsset.open({ balance: bal }) }}
                                leftIcon={<FiUpload />}>
                                Send
                            </Button>
                        </Td>
                        <Td isNumeric>
                            <Button
                                color='green.800'
                                bgColor='green.200'
                                _hover={{
                                    color: 'green.700',
                                    bgColor: 'green.100'
                                }}
                                onClick={() => { receiveAsset.open({ balance: bal }) }}
                                leftIcon={<FiDownload />}>
                                Receive
                            </Button>
                        </Td>
                    </Tr>)}
                </Tbody>
            </Table>
        </TableContainer>
    )
}