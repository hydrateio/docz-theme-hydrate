import * as React from 'react'
import { Component } from 'react'
import { Link, Entry, ThemeConfig } from 'docz'
import styled from '@emotion/styled'
import { css } from 'emotion'

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
  padding: 4px var(--sidebar-padding);
  font-weight: 400;
  font-size: 15px;
  letter-spacing: -0.02em;
  color: ${colors.sidebarText};
  text-decoration: none;
  transition: color 0.2s;

  &:focus,
  &:hover,
  &:visited {
    color: ${colors.sidebarText};
  }

  &:first-line {
    line-height: 22px;
  }

  &.active:not(.no-highlight) {
    font-weight: bold;

    &:before {
      z-index: 1;
      position: absolute;
      display: block;
      content: '';
      top: 0;
      left: 0;
      width: 0;
      height: 30px;
      background: ${colors.primary};
      transition: width 0.2s;
    }

    &.active:before {
      width: 3px;
    }
  }
`

const LinkAnchor = styled('a')`
  ${p => linkStyle(p.theme.docz)};
  font-size: 14px;
  ${p =>
    !!p.icon &&
    css`
      padding-right: 44px;
      position: relative;
      &:after {
        content: url(${p.icon});
        position: absolute;
        top: calc(50% - 10px);
        right: 20px;
        height: 16px;
        width: 16px;
        vertical-align: -4px;
      }
    `}
`

export const getActiveFromClass = (el: HTMLElement | null) =>
  Boolean(el && el.classList.contains('active'))

interface LinkProps {
  item: Menu | Entry
  onClick?: React.MouseEventHandler<any>
  className?: string
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
    const {
      item,
      children,
      onClick,
      isItem,
      onMouseEnter,
      onMouseLeave,
      level,
    } = this.props

    const commonProps = (config: any) => ({
      children,
      onClick,
      className: linkStyle({ ...config.themeConfig, isItem, level }),
      ref: (node: any) => {
        this.$el = node
      },
    })

    return (
      <Wrapper
        active={active}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        level={level}
      >
        <ThemeConfig>
          {config => {
            const route: any = item.route === '/' ? '/' : item.route
            const { ref, ...props } = { ...commonProps(config) }

            if (item.type === 'external-link') {
              return <LinkAnchor ref={ref} {...props} icon={item.icon} href={item.href} />
            }

            if (item.route) {
              if (location.hash) {
                props.activeClassName = 'active no-highlight'
              }
              return <Link innerRef={ref} {...props} to={route} />
            }

            return <LinkAnchor ref={ref} {...props} href="#" />
          }}
        </ThemeConfig>
        {active && item.route && <MenuHeadings route={item.route} />}
      </Wrapper>
    )
  }

  private updateActive = (prevActive: boolean): void => {
    const active = getActiveFromClass(this.$el)
    if (prevActive !== active) this.setState({ active })
  }
}
