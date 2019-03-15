import * as React from 'react'
import { Component } from 'react'
import styled from '@emotion/styled'
import SearchIcon from 'react-feather/dist/icons/search'
import placeholder from 'polished/lib/mixins/placeholder'
import rgba from 'polished/lib/color/rgba'
import match from 'match-sorter'
import flattenDeep from 'lodash/flattendeep'
import { Docs } from 'docz'

import { get } from '@utils/theme'
import { getMenusFromDocs, Menus } from '../../../utils/getMenusFromDocs'
import {
  SearchCtxConsumer,
  SearchContext as SearchContextType,
} from './SearchContext'

export const SearchContext = React.createContext({})

const sidebarText = get('colors.sidebarText')

const Wrapper = styled('div')`
  background-color: #fff;
  display: flex;
  align-items: center;
  opacity: 1;
`

const Icon = styled(SearchIcon)`
  stroke: ${sidebarText};
  width: 20px;
  opacity: 0.5;
`

const Field = styled('div')`
  border: 1px solid ${p => rgba(sidebarText(p), 0.3)};
  box-shadow: 0 0px 2px ${p => rgba(sidebarText(p), 0.1)};
  border-radius: 4px;
  display: flex;
  align-items: center;

  padding-right: 10px;

  ${p =>
    p.theme.docz.mq({
      flexBasis: ['100%', '100%', '100%', '50%'],
    })};
`

const Input = styled('input')`
  outline: none;
  width: 100%;
  padding: 15px 5px 15px 20px;
  background: transparent;
  border: none;
  font-size: 15px;
  line-height: 1.6;
  color: ${sidebarText};

  ${p =>
    placeholder({
      color: rgba(sidebarText(p), 0.5),
    })};

  ${p =>
    p.theme.docz.mq({
      paddingTop: ['6px', '6px', '15px'],
      paddingBottom: ['6px', '6px', '15px'],
      paddingLeft: ['6px', '6px', '20px'],
    })};
`
type SidebarProps = SearchContextType

interface SidebarState {
  lastVal: string
}

class SearchInput extends Component<SidebarProps, SidebarState> {
  public state = {
    lastVal: '',
  }

  public render(): React.ReactNode {
    return (
      <Docs>
        {({ docs }) => {
          const initial = getMenusFromDocs(docs, this.props.menuConfig)
          const menus = this.props.menus || initial

          return (
            <Wrapper>
              <Field>
                <Input
                  type="text"
                  placeholder="Search FAQS, products, resources, ..."
                  onChange={(ev: any) =>
                    this.handleSearch(initial, menus, ev.target.value)
                  }
                />
                <Icon />
              </Field>
            </Wrapper>
          )
        }}
      </Docs>
    )
  }

  private match = (val: string, menu: Menus) => {
    const getItemsFromMenus = (menus: Menus) => {
      const items: Menus = []
      const loop = (itemMenus: Menus) => {
        itemMenus.forEach(menu => {
          if (menu.items) {
            items.push(menu.items)
          }
          if (menu.menus) {
            loop(menu.menus)
          }
        })
      }
      loop(menus)
      return items
    }

    const items = menu.map(item => {
      let items: Menus = []
      const concat = (arr: Menus) => {
        items = new Array().concat(items, arr)
      }
      if (!item.items && !item.menus) {
        concat([item])
      }
      if (item.items) {
        concat(item.items)
      }
      if (item.menus) {
        concat(getItemsFromMenus(item.menus))
      }
      return items
    })
    const flattened = flattenDeep(items)
    return match(flattened, val, { keys: ['name'] })
  }

  private search = (initial: Menus, menus: Menus, val: string) => {
    const change = !val.startsWith(this.state.lastVal)

    this.setState({ lastVal: val })
    return this.match(val, change ? initial : menus)
  }

  private handleSearch = (initial: Menus, menus: Menus, val: string) => {
    const { setMenus, setSearching } = this.props
    const isEmpty = val.length === 0

    setMenus(isEmpty ? initial : this.search(initial, menus, val))
    setSearching(!isEmpty)
  }
}

const Search = () => (
  <SearchCtxConsumer>{props => <SearchInput {...props} />}</SearchCtxConsumer>
)

export { Search }
