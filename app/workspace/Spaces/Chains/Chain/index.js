import React from 'react'
import Restore from 'react-restore'

import ChainPreview from './ChainPreview'
import ChainExpanded from './ChainExpanded'
import { Chain } from './ChainNew'

class ChainWrapper extends React.Component {
  renderNew() {
    const {
      id,
      name,
      type,
      explorer,
      symbol,
      primaryRpc,
      secondaryRpc,
      icon,
      nativeCurrencyName,
      nativeCurrencyIcon
    } = this.props
    const existingChains = Object.keys(this.store('main.networks.ethereum')).map((id) => parseInt(id))
    return (
      <Chain
        id={id}
        name={name}
        type={type}
        explorer={explorer}
        symbol={symbol}
        primaryRpc={primaryRpc}
        secondaryRpc={secondaryRpc}
        existingChains={existingChains}
        icon={icon}
        nativeCurrencyName={nativeCurrencyName}
        nativeCurrencyIcon={nativeCurrencyIcon}
        store={this.store}
      />
    )
  }

  renderExpanded() {
    const {
      id,
      name,
      type,
      explorer,
      symbol,
      isTestnet,
      filter,
      on,
      connection,
      nativeCurrencyName,
      icon,
      nativeCurrencyIcon
    } = this.props
    const { primaryColor } = this.store('main.networksMeta.ethereum', id)
    const price = this.store('main.networksMeta.ethereum', id, 'nativeCurrency.usd.price') || '?'
    return (
      <ChainExpanded
        id={id}
        name={name}
        type={type}
        explorer={explorer}
        symbol={symbol}
        isTestnet={isTestnet}
        filter={filter}
        on={on}
        connection={connection}
        primaryColor={primaryColor}
        icon={icon}
        nativeCurrencyName={nativeCurrencyName}
        nativeCurrencyIcon={nativeCurrencyIcon}
        price={price}
      />
    )
  }

  renderPreview() {
    const { id, name, type, symbol, filter, on, explorer, icon } = this.props
    const { primaryColor } = this.store('main.networksMeta.ethereum', id)
    const price = this.store('main.networksMeta.ethereum', id, 'nativeCurrency.usd.price') || '?'

    if (
      filter &&
      !this.state.id.toString().includes(filter) &&
      !this.state.name.includes(filter) &&
      !this.state.symbol.includes(filter) &&
      !this.state.explorer.includes(filter) &&
      !this.state.type.includes(filter)
    )
      return null

    return (
      <ChainPreview
        type={type}
        id={id}
        explorer={explorer}
        primaryColor={primaryColor}
        icon={icon}
        name={name}
        on={on}
        symbol={symbol}
        price={price}
      />
    )
  }

  render() {
    const { view } = this.props
    if (view === 'setup') {
      return this.renderNew()
    } else if (view === 'expanded') {
      return this.renderExpanded()
    } else if (view === 'preview') {
      return this.renderPreview()
    }
  }
}

export default Restore.connect(ChainWrapper)
