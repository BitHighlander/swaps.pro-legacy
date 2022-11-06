import {
    ArrowDownIcon,
    ArrowUpIcon, ChevronDownIcon,
    ChevronRightIcon,
    CloseIcon,
    RepeatIcon,
    TriangleDownIcon
} from '@chakra-ui/icons'
import {
    Box,
    Button,
    Circle,
    FlexProps,
    Image,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon, HStack, Text, Flex,
} from '@chakra-ui/react'
import { InitialState, useWallet, WalletActions } from 'context/WalletProvider/WalletProvider'
import { FC } from 'react'
import { OnboardButton } from './OnboardButton'
import { KeplrButton } from './KeplrButton'
import { PioneerButton } from './PioneerButton'
import { KeepKeyButton } from './KeepKeyButton'
import {shortenAddress} from "../../../../utils/helpers";
type WalletImageProps = {
  isConnected: Boolean
} & Pick<InitialState, 'walletInfo'>

const WalletImage: React.FC<WalletImageProps> = ({ isConnected, walletInfo }) =>
  isConnected ? (
    <Image
      boxSize='24px'
      loading='lazy'
      // showBorder={false}
      objectFit='contain'
      bg='transparent'
      src={walletInfo?.icon}
    />
  ) : null

export const WalletButton: FC<FlexProps> = () => {
  const { state, dispatch, disconnect, setRoutePath, connect } = useWallet()
  const { isConnected, walletInfo, username, context, keepkey, onboard } = state

  const openSend = function(wallet:string){
    console.log("wallet: ",wallet)
    setRoutePath('/Send/Send')
    dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
  }

  const openReceive = function(wallet:string){
    console.log("wallet: ",wallet)
    setRoutePath('/Receive/Receive')
    dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })
  }

  return !username ? (
    <Button
      onClick={() => dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true })}
      rightIcon={<ChevronRightIcon h={6} w={6} />}
      mr={6}
    >
      Connect Wallet
    </Button>
  ) : (
    <Menu gutter={4}>
      <MenuButton
        as={Button}
        // leftIcon={<WalletImage isConnected={isConnected} walletInfo={pioneer.walletInfo} />}
        rightIcon={<TriangleDownIcon h={3} w={3} />}
        mr={6}
      >
        {username.substring(0, 28)}...
      </MenuButton>
      <MenuList minW='300px'>
        <MenuGroup title='Wallets'>
          {/*context: {context?.substring(0, 28)}*/}
          <Accordion>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    KeepKey: <KeepKeyButton />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                  {!keepkey ? (
                      <div>
                      {/*<MenuItem*/}
                      {/*    icon={*/}
                      {/*        <Circle bg='whiteAlpha.200' size={8}>*/}
                      {/*            <ArrowUpIcon />*/}
                      {/*        </Circle>*/}
                      {/*    }*/}
                      {/*    onClick={ () => openSend('keepkey')}*/}
                      {/*>*/}
                      {/*    Send*/}
                      {/*</MenuItem>*/}
                      {/*<MenuItem*/}
                      {/*    icon={*/}
                      {/*        <Circle bg='whiteAlpha.200' size={8}>*/}
                      {/*            <ArrowDownIcon />*/}
                      {/*        </Circle>*/}
                      {/*    }*/}
                      {/*    onClick={ () => openReceive('keepkey')}*/}
                      {/*>*/}
                      {/*    Receive*/}
                      {/*</MenuItem>*/}
                      <MenuItem
                          icon={
                              <Circle bg='whiteAlpha.200' size={8}>
                                  <CloseIcon />
                              </Circle>
                          }
                          onClick={disconnect}
                      >
                          Disconnect
                      </MenuItem>
                      </div>
                  ) : (
                      <>
                      </>
                  )}
              </AccordionPanel>
            </AccordionItem>
            {/*<AccordionItem>*/}
            {/*  <h2>*/}
            {/*    <AccordionButton>*/}
            {/*      <Box flex="1" textAlign="left">*/}
            {/*        OnBoard: <OnboardButton />*/}
            {/*      </Box>*/}
            {/*      <AccordionIcon />*/}
            {/*    </AccordionButton>*/}
            {/*  </h2>*/}
            {/*  <AccordionPanel pb={4}>*/}
            {/*      {onboard ? (*/}
            {/*          <div>*/}
            {/*              <MenuItem*/}
            {/*                  icon={*/}
            {/*                      <Circle bg='whiteAlpha.200' size={8}>*/}
            {/*                          <ArrowUpIcon />*/}
            {/*                      </Circle>*/}
            {/*                  }*/}
            {/*                  onClick={ () => openSend('onboard')}*/}
            {/*              >*/}
            {/*                  Send*/}
            {/*              </MenuItem>*/}
            {/*              <MenuItem*/}
            {/*                  icon={*/}
            {/*                      <Circle bg='whiteAlpha.200' size={8}>*/}
            {/*                          <ArrowDownIcon />*/}
            {/*                      </Circle>*/}
            {/*                  }*/}
            {/*                  onClick={ () => openReceive('onboard')}*/}
            {/*              >*/}
            {/*                  Receive*/}
            {/*              </MenuItem>*/}
            {/*              <MenuItem*/}
            {/*                  icon={*/}
            {/*                      <Circle bg='whiteAlpha.200' size={8}>*/}
            {/*                          <RepeatIcon />*/}
            {/*                      </Circle>*/}
            {/*                  }*/}
            {/*                  onClick={ () => openReceive('onboard')}*/}
            {/*              >*/}
            {/*                  Switch Wallet Provider*/}
            {/*              </MenuItem>*/}
            {/*              <MenuItem*/}
            {/*                  icon={*/}
            {/*                      <Circle bg='whiteAlpha.200' size={8}>*/}
            {/*                          <CloseIcon />*/}
            {/*                      </Circle>*/}
            {/*                  }*/}
            {/*                  onClick={disconnect}*/}
            {/*              >*/}
            {/*                  Disconnect*/}
            {/*              </MenuItem>*/}
            {/*          </div>*/}
            {/*      ) : (*/}
            {/*          <>*/}
            {/*          </>*/}
            {/*      )}*/}
            {/*  </AccordionPanel>*/}
            {/*</AccordionItem>*/}

            {/*<AccordionItem>*/}
            {/*  <h2>*/}
            {/*    <AccordionButton>*/}
            {/*      <Box flex="1" textAlign="left">*/}
            {/*        keplr: <KeplrButton />*/}
            {/*      </Box>*/}
            {/*      <AccordionIcon />*/}
            {/*    </AccordionButton>*/}
            {/*  </h2>*/}
            {/*  <AccordionPanel pb={4}>*/}
            {/*      {!false ? (*/}
            {/*          <div>*/}
            {/*              <MenuItem*/}
            {/*                  icon={*/}
            {/*                      <Circle bg='whiteAlpha.200' size={8}>*/}
            {/*                          <ArrowUpIcon />*/}
            {/*                      </Circle>*/}
            {/*                  }*/}
            {/*                  onClick={ () => openSend('keplr')}*/}
            {/*              >*/}
            {/*                  Send*/}
            {/*              </MenuItem>*/}
            {/*              <MenuItem*/}
            {/*                  icon={*/}
            {/*                      <Circle bg='whiteAlpha.200' size={8}>*/}
            {/*                          <ArrowDownIcon />*/}
            {/*                      </Circle>*/}
            {/*                  }*/}
            {/*                  onClick={ () => openReceive('keplr')}*/}
            {/*              >*/}
            {/*                  Receive*/}
            {/*              </MenuItem>*/}
            {/*              <MenuItem*/}
            {/*                  icon={*/}
            {/*                      <Circle bg='whiteAlpha.200' size={8}>*/}
            {/*                          <CloseIcon />*/}
            {/*                      </Circle>*/}
            {/*                  }*/}
            {/*                  onClick={disconnect}*/}
            {/*              >*/}
            {/*                  Disconnect*/}
            {/*              </MenuItem>*/}
            {/*          </div>*/}
            {/*      ) : (*/}
            {/*          <>*/}
            {/*          </>*/}
            {/*      )}*/}
            {/*  </AccordionPanel>*/}
            {/*</AccordionItem>*/}
          </Accordion>
        </MenuGroup>
        <MenuDivider />
      </MenuList>
    </Menu>
  )
}
