import { Button, Image, ModalBody, ModalHeader, Stack, Text } from '@chakra-ui/react'
import { RawText } from 'components/Text'

import { SUPPORTED_WALLETS } from './config'

export const SelectModal = ({ connect }: { connect: (adapter: string) => Promise<void> }) => {
  return (
    <>
      <ModalHeader>Connect a wallet</ModalHeader>
      <ModalBody>
        <RawText mb={6} color='gray.500'>
        </RawText>
        <Stack mb={6}>
            {console.log(SUPPORTED_WALLETS)}
          {Object.keys(SUPPORTED_WALLETS).map(key => {
            const option = SUPPORTED_WALLETS[key]
            return (
              <>
                  <small>type: {option.type}</small>
                  <Button
                  variant='ghost-filled'
                  colorScheme='blue'
                  key={key}
                  w='full'
                  h='auto'
                  px={6}
                  py={4}
                  justifyContent='space-between'
                  onClick={() => connect(key)}
                >
                  <div>
                      <Text fontWeight='semibold'>{option.name}</Text>
                  </div>
                  <div>
                  {option.support ? (
                      <small>{option.support.map((entry:any, i:any) => {
                          return (<small>Supports: <br/><Image maxH={7} maxW={10} src={entry.icon} />{entry.name}</small>)
                      })}</small>
                  ) : (
                      <small></small>
                  )}
                  </div>
                      <div>
                          <Image maxH={10} maxW={20} src={option.icon} />
                      </div>
                </Button>
              </>
            )
          })}
        </Stack>
      </ModalBody>
    </>
  )
}
