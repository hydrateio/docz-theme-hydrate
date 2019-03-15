import * as React from 'react'
import { Component } from 'react'
import ChevronDown from 'react-feather/dist/icons/chevron-down'
import styled from '@emotion/styled'
import { Entry } from 'docz'
import { Portal } from 'react-portal'

import { MenuLink } from './MenuLink'
import { SubMenu } from './SubMenu'
import { get } from '@utils/theme'
import { Menu as MenuType } from '@utils/getMenusFromDocs'

interface WrapperProps {
  level: number
  opened: boolean
  hasMenus: boolean
}

const sidebarBg = get('colors.sidebarBg')

const Wrapper = styled('div')`
  background-color: ${sidebarBg};
  display: flex;
  flex-direction: column;
  width: ${(p: WrapperProps) =>
    p.level === 0 ? 'var(--sidebar-width)' : 'auto'};
  min-width: ${(p: WrapperProps) =>
    p.level === 0 ? 'var(--sidebar-width)' : '0'};
  margin-bottom: ${p => (p.level > 0 ? 0 : 36)}px;
`

const iconRotate = (p: OpenedProps) => (p.opened ? '-180deg' : '0deg')

const Icon = styled('div')`
  position: absolute;
  pointer-events: none;
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
    stroke: ${get('colors.sidebarText')};
    stroke-width: 2px;
  }
`

export interface MenuProps {
  item: MenuType | Entry
  sidebarToggle: (ev: React.SyntheticEvent<any>) => void
  collapseAll: boolean
  level: number
  levels: number
  isDesktop: boolean
}

export interface MenuState {
  opened: boolean
  hasActive: boolean
  hovered: boolean
  menuPosition: { top: number; left: number } | undefined
}

export class Menu extends Component<MenuProps, MenuState> {
  public menu: HTMLElement | null
  public state: MenuState = {
    opened: false,
    hasActive: false,
    hovered: false,
    menuPosition: undefined,
  }
  public timer: number | null

  constructor(props: MenuProps) {
    super(props)
    this.menu = null
    this.timer = null
  }

  public componentDidMount(): void {
    this.checkActiveLink()
  }

  public render(): React.ReactNode {
    const { item, collapseAll, level, isDesktop } = this.props

    const hover = this.state.hovered
    const show = collapseAll || this.state.opened
    const hasHeadings = Boolean(item.headings && item.headings.length > 0)
    const hasItems = Boolean(item.items && item.items.length > 0)
    const hasMenus = Boolean(item.menus && item.menus.length > 0)
    const hasChildren = hasItems || hasMenus
    const hasToggle = hasChildren

    const handleToggle = (ev: any) => {
      ev.preventDefault()
      this.toggle()
    }

    const mouseEvents = {
      onMouseEnter: this.menuLinkMouseEnter,
      onMouseLeave: this.onMouseLeave,
    }

    return (
      <Wrapper
        hasMenus={hasMenus}
        opened={show}
        level={level}
        ref={(node: any) => {
          this.menu = node
        }}
      >
        <MenuLink
          item={item}
          {...!show && isDesktop && { ...mouseEvents }}
          {...hasToggle && { onClick: handleToggle }}
          level={level}
        >
          {item.name}
          {(hasChildren || hasHeadings) && (
            <Icon opened={show}>
              <ChevronDown size={15} />
            </Icon>
          )}
        </MenuLink>
        {hasChildren && <SubMenu show={show} {...this.props} />}
        {hasChildren && !show && hover && level > 0 && (
          <Portal>
            <SubMenu
              show={show}
              {...this.props}
              hovered={true}
              menuPosition={this.state.menuPosition}
              {...isDesktop && {
                onMouseEnter: this.subMenuMouseEnter,
                onMouseLeave: this.onMouseLeave,
              }}
            />
          </Portal>
        )}
      </Wrapper>
    )
  }

  private toggle = (): void => {
    this.setState(state => ({ opened: !state.opened }))
  }

  private checkActiveLink = (): void => {
    const { isDesktop } = this.props
    const activeLink = this.menu && this.menu.querySelector('a.active')
    const hasActive = Boolean(activeLink)
    if (hasActive) {
      this.setState({ hasActive, opened: true })
      if (isDesktop) {
        setTimeout(() => activeLink && activeLink.scrollIntoView())
      }
    }
  }

  private menuLinkMouseEnter = (e: React.SyntheticEvent<any>): void => {
    e.stopPropagation()
    const { top, right } = e.currentTarget.getBoundingClientRect()
    const menuPosition = { top, left: right }

    this.setState({ hovered: true, menuPosition })
    this.clearTimer()
  }

  private subMenuMouseEnter = (e: React.SyntheticEvent<any>): void => {
    this.setState({ hovered: true })
    this.clearTimer()
  }

  private onMouseLeave = (e: React.SyntheticEvent<any>): void => {
    this.setTimer()
  }

  private clearTimer = () => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = null
  }

  private setTimer = () => {
    this.clearTimer()
    this.timer = setTimeout(this.checkHovered, 100)
  }

  private checkHovered = () => {
    if (this.timer) {
      this.setState({ hovered: false })
    }
  }
}
