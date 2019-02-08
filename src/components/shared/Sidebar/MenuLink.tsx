import * as React from 'react'
import { Component } from 'react'
import { Link, Entry, ThemeConfig } from 'docz'
import styled, { css } from 'react-emotion'

import { MenuHeadings } from './MenuHeadings'
import { Menu } from '@utils/getMenusFromDocs'

interface WrapperProps {
  active: boolean
  theme?: any
}

const activeWrapper = css`
  padding-left: 0;

  &:after {
    width: 1px;
  }
`

const Wrapper = styled('div')`
  position: relative;
  transition: padding 0.2s;
  ${(p: WrapperProps) => p.active && activeWrapper};
`

export const linkStyle = ({ colors, isItem, level }: any) => css`
  position: relative;
  display: block;
  padding: 4px 36px;
  font-weight: 400;
  font-size: ${level > 0 ? 16 : 20}px;
  letter-spacing: -0.02em;
  color: ${colors.sidebarText};
  text-decoration: none;
  transition: color 0.2s;

  &:focus,
  &:hover,
  &:visited {
    color: ${colors.sidebarText};
  }

  &.active {
    color: ${colors.sidebarActive};
  }
`

const LinkAnchor = styled('a')`
  ${p => linkStyle(p.theme.docz)};
  font-size: 14px;
`

export const getActiveFromClass = (el: HTMLElement | null) =>
  Boolean(el && el.classList.contains('active'))

interface LinkProps {
  item: Menu | Entry,
  onClick?: React.MouseEventHandler<any>
  className?: string
  innerRef?: (node: any) => void
  isItem?: boolean
  onMouseEnter?: (ev: React.SyntheticEvent<any>) => void
  onMouseLeave?: (ev: React.SyntheticEvent<any>) => void
  level?: number
}

interface LinkState {
  active: boolean
}

export class MenuLink extends Component<LinkProps, LinkState> {
  public $el: HTMLElement | null
  public state: LinkState = {
    active: false,
  }

  constructor(props: LinkProps) {
    super(props)
    this.$el = null
  }

  public componentDidUpdate(prevProps: LinkProps, prevState: LinkState): void {
    this.updateActive(prevState.active)
  }

  public componentDidMount(): void {
    this.updateActive(this.state.active)
  }

  public render(): React.ReactNode {
    const { active } = this.state
    const { item, children, onClick, innerRef, isItem, onMouseEnter, onMouseLeave, level } = this.props

    const commonProps = (config: any) => ({
      children,
      onClick,
      className: linkStyle({ ...config.themeConfig, isItem, level }),
      innerRef: (node: any) => {
        innerRef && innerRef(node)
        this.$el = node
      },
    })

    return (
      <Wrapper active={active} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <ThemeConfig>
          {config => {
            const route: any = item.route === '/' ? '/' : item.route
            const props = { ...commonProps(config) }

            if (item.route) {
              if (location.hash) {
                props.activeClassName = ''
              }
              return <Link {...props} to={route} />
            }

            return <LinkAnchor {...props} href="#" />
          }}
        </ThemeConfig>
        {item.route && <MenuHeadings route={item.route} />}
      </Wrapper>
    )
  }

  private updateActive = (prevActive: boolean): void => {
    const active = getActiveFromClass(this.$el)
    if (prevActive !== active) this.setState({ active })
  }
}
