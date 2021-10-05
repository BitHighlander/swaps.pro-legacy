import { FC } from 'react'
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Text, Image, HStack, FlexProps } from '@chakra-ui/react'
import { shortenAddress } from 'utils/helpers'
import { useWallet } from 'context/WalletProvider/KeplrWalletProvider'

export const KeplrButton: FC<FlexProps> = props => {
    const { state, connect } = useWallet()
    const { isConnected, account } = state

    return (
        <Flex
            borderRadius='full'
            bg='whiteAlpha.400'
            justifyContent='space-between'
            p={1}
            color='white'
            alignItems='center'
            onClick={connect}
            _hover={{ cursor: 'pointer', bg: 'whiteAlpha.500' }}
            {...props}
        >
            {isConnected ? (
                <HStack>
                    <Image
                        maxW='28px'
                        maxH='28px'
                        ml={2}
                    />
                    <Text fontSize='sm'>{account && shortenAddress(account, 4)}</Text>
                    <ChevronDownIcon h={8} w={8} />
                </HStack>
            ) : (
                <>
                    <Text fontSize='sm' ml={2}>
                        Connect Keplr
                    </Text>
                    <ChevronRightIcon h={8} w={8} />
                </>
            )}
        </Flex>
    )
}
