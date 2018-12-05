import * as React from 'react'
import { Component } from 'react'
import ChevronDown from 'react-feather/dist/icons/chevron-down'
import styled from 'react-emotion'
import { Entry } from 'docz'

import { MenuLink, getActiveFromClass } from './MenuLink'
import { get } from '@utils/theme'
import { Menu as MenuItem } from '@utils/getMenusFromDocs'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

interface OpenedProps {
  opened: boolean
}

const List = styled('dl')`
  flex: 1;
  overflow-y: auto;
  visibility: ${(p: OpenedProps) => (p.opened ? 'visible' : 'hidden')};
  max-height: ${(p: OpenedProps) => (p.opened ? 'auto' : '0px')};
`

const iconRotate = (p: OpenedProps) => (p.opened ? '-180deg' : '0deg')

const Icon = styled('div')`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%) rotate(${iconRotate});
  transform-origin: 50% 50%;
  transition: transform 0.3s;

  & svg {
    height: 1rem;
    width: 1rem;
    stroke: ${get('colors.primary')};
    stroke-width: 3px;
  }
`

export interface MenuProps {
  item: MenuItem
  sidebarToggle: (ev: React.SyntheticEvent<any>) => void
  collapseAll: boolean
}

export interface MenuState {
  opened: boolean
  hasActive: boolean
}

export class Menu extends Component<MenuProps, MenuState> {
  public menu: HTMLElement | null
  public $els: HTMLElement[]
  public state: MenuState = {
    opened: false,
    hasActive: false
  }

  constructor(props: MenuProps) {
    super(props)
    this.$els = []
    this.menu = null
  }

  public componentDidMount(): void {
    this.checkActiveLink()
  }

  public render(): React.ReactNode {
    const { item, sidebarToggle, collapseAll } = this.props

    const show = collapseAll || this.state.opened
    const hasChildren = !item.href && ((item.items && item.items.length > 0) || (item.menus && item.menus.length > 0))
    const hasToggle = !item.href && !item.route

    const handleToggle = (ev: any) => {
      ev.preventDefault()
      this.toggle()
    }

    return (
      <Wrapper innerRef={(node: any) => {
        this.menu = node
      }}>
        <MenuLink item={item} {...hasToggle && { onClick: handleToggle }}>
          {item.name}
          {hasChildren && (
            <Icon opened={show}>
              <ChevronDown size={15} />
            </Icon>
          )}
        </MenuLink>
        {hasChildren && (
          <List opened={show}>
            {item.menus &&
              item.menus.map(menu => {
                return (
                  <dt key={menu.name}>
                    <Menu
                      key={menu.name}
                      item={menu}
                    >
                      {menu.name}
                    </Menu>
                  </dt>
                )
              })}
            {item.items &&
              item.items.map((item: Entry) => (
                <dt key={item.id}>
                  <MenuLink
                    item={item}
                    onClick={sidebarToggle}
                    innerRef={(node: any) => {
                      this.$els = this.$els.concat([node])
                    }}
                  >
                    {item.name}
                  </MenuLink>
                </dt>
              ))}
          </List>
        )}
      </Wrapper>
    )
  }

  private toggle = (): void => {
    this.setState(state => ({ opened: !state.opened }))
  }

  private checkActiveLink = (): void => {
    const hasActive = Boolean(this.menu && this.menu.querySelector('a.active[aria-current="page"]'))
    if (hasActive) this.setState({ hasActive, opened: true })
  }
}
