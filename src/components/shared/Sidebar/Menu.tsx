import * as React from 'react'
import { Component } from 'react'
import ChevronDown from 'react-feather/dist/icons/chevron-down'
import styled, { css } from 'react-emotion'
import { Entry } from 'docz'

import { MenuLink } from './MenuLink'
import { get } from '@utils/theme'
import { Menu as MenuType } from '@utils/getMenusFromDocs'

interface WrapperProps {
  level: number
  opened: boolean
  hasMenus: boolean
}

interface OpenedProps {
  opened: boolean
}

const List = styled('dl')`
  flex: 1;
  overflow: hidden;
  visibility: ${(p: OpenedProps) => (p.opened ? 'visible' : 'hidden')};
  max-height: ${(p: OpenedProps) => (p.opened ? 'none' : '0px')};
`

const sidebarBg = get('colors.sidebarBg')

const closedWrapperStyles = (p: WrapperProps) => css`
  background: ${sidebarBg(p)};
  position: relative;
  & ${List} {
    margin: 0;
  }
  &:hover > ${List} {
    background: ${sidebarBg(p)};
    position: absolute;
    top: 0;
    left: 100%;
    visibility: visible;
    max-height: none;
    width: 100%;
    ${List} {
      position: static;
    }
  }
`

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  width: ${(p: WrapperProps) => p.level === 0 ? '280px' : 'auto'};
  min-width: ${(p: WrapperProps) => p.level === 0 ? '280px' : '0'};

  ${(p: WrapperProps) => !p.opened && closedWrapperStyles(p)}

  &:hover > ${List} {
    overflow: ${(p: WrapperProps) => !p.hasMenus ? 'auto' : 'visible'};
  }
`

const iconRotate = (p: OpenedProps) => (p.opened ? '-180deg' : '0deg')

const Icon = styled('div')`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%) rotate(${iconRotate});
  transform-origin: 50% 50%;
  transition: transform 0.3s;
  height: 1rem;
  width: 1rem;

  & svg {
    position: absolute;
    top: 0;
    left: 0;
    height: 1rem;
    width: 1rem;
    stroke: ${get('colors.primary')};
    stroke-width: 3px;
  }
`

export interface MenuProps {
  item: MenuType | Entry
  sidebarToggle: (ev: React.SyntheticEvent<any>) => void
  collapseAll: boolean
  level: number
  levels: number
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
    const { item, sidebarToggle, collapseAll, level, levels } = this.props

    const show = collapseAll || this.state.opened
    const hasItems = Boolean(item.items && item.items.length > 0)
    const hasMenus = Boolean(item.menus && item.menus.length > 0)
    const hasChildren = hasItems || hasMenus
    const hasToggle = hasChildren

    const handleToggle = (ev: any) => {
      ev.preventDefault()
      this.toggle()
    }

    return (
      <Wrapper hasMenus={hasMenus} opened={show} level={level} innerRef={(node: any) => {
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
            {item.items &&
              item.items.map((item: Entry) => (
                <dt key={item.id}>
                  <MenuLink
                    item={item}
                    onClick={sidebarToggle}
                    innerRef={(node: any) => {
                      this.$els = this.$els.concat([node])
                    }}
                    isItem={true}
                  >
                    {item.name}
                  </MenuLink>
                </dt>
              ))}
            {item.menus &&
              item.menus.map((menu: MenuType) => {
                return (
                  <dt key={menu.name}>
                    <Menu
                      key={menu.name}
                      sidebarToggle={sidebarToggle}
                      item={menu}
                      collapseAll={collapseAll}
                      level={level + 1}
                      levels={levels}
                    >
                      {menu.name}
                    </Menu>
                  </dt>
                )
              })}
          </List>
        )}
      </Wrapper>
    )
  }

  private toggle = (): void => {
    this.setState(state => ({ opened: !state.opened }))
  }

  private checkActiveLink = (): void => {
    const hasActive = Boolean(this.menu && this.menu.querySelector('a.active'))
    if (hasActive) this.setState({ hasActive, opened: true })
  }
}
