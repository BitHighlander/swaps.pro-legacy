import { Box, Button, Text, useColorModeValue } from '@chakra-ui/react'
// import { SwapCurrency } from '@shapeshiftoss/market-service'
import { AssetIcon } from 'components/AssetIcon'
import { useMatch } from 'react-router-dom'
import { ListChildComponentProps } from 'react-window'

export const AssetRow: React.FC<ListChildComponentProps> = ({ data, index, style }) => {
  const token: any = data.items[index]
  const { handleClick } = data
  const match = useMatch<{ address: string }>()
  const active = match?.params?.address === token?.address || false

  return (
    <Button
      variant='ghost'
      onClick={() => handleClick(token)}
      isActive={active}
      justifyContent='flex-start'
      style={style}
      _focus={{
        shadow: 'outline-inset'
      }}
    >
      <AssetIcon src={token?.image} boxSize='24px' mr={4} />
      <Box textAlign='left'>
        <Text lineHeight={1}>{token.symbol}</Text>
        <Text
          fontWeight='normal'
          fontSize='sm'
          color={useColorModeValue('gray.500', 'whiteAlpha.500')}
        >
          {token.name}
        </Text>
      </Box>
    </Button>
  )
}
