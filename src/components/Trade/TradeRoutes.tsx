import { SwapCurrency } from '@shapeshiftoss/market-service'
import { AnimatePresence } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import { Redirect, Route, RouteProps, Switch, useHistory, useLocation } from 'react-router-dom'

import { TradeConfirm } from './TradeConfirm/TradeConfirm'
import { TradeInput } from './TradeInput'
import { SelectAsset } from './SelectAsset'
import { TradeStatus } from './TradeStatus/TradeStatus'

export const entries = ['/send/details', '/send/confirm']

export const TradeRoutes = () => {
  const location = useLocation()
  const history = useHistory()
  const { setValue } = useFormContext()
  const handleSellClick = (asset: SwapCurrency) => {
    console.log("handleSellClick: ")
    setValue('sellAsset.currency', asset)
    history.push('/trade/input')
  }
  const handleBuyClick = (asset: SwapCurrency) => {
    console.log("handleBuyClick: ")
    setValue('buyAsset.currency', asset)
    history.push('/trade/input')
  }
  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <Switch location={location} key={location.key}>
        <Route
          path='/trade/select/sell'
          component={(props: RouteProps) => <SelectAsset onClick={handleSellClick} {...props} />}
        />
        <Route
          path='/trade/select/buy'
          component={(props: RouteProps) => <SelectAsset onClick={handleBuyClick} {...props} />}
        />
        <Route path='/trade/input' component={TradeInput} />
        <Route path='/trade/confirm' component={TradeConfirm} />
        <Route path='/trade/status' component={TradeStatus} />
        <Redirect from='/' to='/trade/input' />
      </Switch>
    </AnimatePresence>
  )
}
