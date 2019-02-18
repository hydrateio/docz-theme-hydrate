import React, { Component } from 'react'
import { Docs, DocsRenderProps } from 'docz'
import { getMenusFromDocs, Menus } from '../../../utils/getMenusFromDocs'

interface Props {
  docs: DocsRenderProps['docs']
}

export interface SearchContext {
  menus: Menus | []
  searching: boolean
  setSearching: (arg0: boolean) => void
  setMenus: (arg0: Menus) => void
}

type State = SearchContext

const SearchContext = React.createContext<State | null>(null)

class Provider extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      menus: getMenusFromDocs(props.docs),
      searching: false,
      setMenus: this.setMenus,
      setSearching: this.setSearching,
    }
  }

  public render(): React.ReactNode {
    return (
      <SearchContext.Provider value={this.state}>
        {this.props.children}
      </SearchContext.Provider>
    )
  }

  private setMenus = (menus: Menus) => {
    this.setState(state => ({
      ...state,
      menus,
    }))
  }

  private setSearching = (searching: boolean) => {
    this.setState(state => ({
      ...state,
      searching,
    }))
  }
}

const SearchCtxConsumer = SearchContext.Consumer

const SearchCtxProvider: React.FunctionComponent = props => (
  <Docs>{({ docs }) => <Provider docs={docs} {...props} />}</Docs>
)

export { SearchCtxProvider, SearchCtxConsumer }
