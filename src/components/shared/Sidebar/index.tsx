import * as React from 'react'
import { Component } from 'react'
import withSizes from 'react-sizes'
import styled from 'react-emotion'

import { Logo } from '../Logo'
import { SearchCtxConsumer } from '../Search/SearchContext'
import { Menu } from './Menu'
import { Hamburguer } from './Hamburguer'
import { Title } from './Title'
import { Search } from '../Search'

import { get } from '@utils/theme'
import { mq, breakpoints } from '@styles/responsive'

interface WrapperProps {
  opened: boolean
  theme?: any
}

const sidebarBg = get('colors.sidebarBg')
const sidebarText = get('colors.sidebarText')
const sidebarBorder = get('colors.sidebarBorder')

const Wrapper = styled('div')`
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
  position: relative;
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  min-height: calc(100vh - var(--color-bar-height));
  background: ${sidebarBg};
  transition: transform 0.2s, background 0.3s;
  z-index: 2;

  ${get('styles.sidebar')};
  ${mq({
    position: ['absolute', 'absolute', 'absolute', 'relative'],
  })};

  dl {
    padding: 0;
    margin: 0;
  }

  @media screen and (max-width: ${breakpoints.desktop - 1}px) {
    transform: translateX(${(p: WrapperProps) => (p.opened ? '-100%' : '0')});
  }
`

const Content = styled('div')`
  position: fixed;
  top: var(--color-bar-height);
  left: 0;
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  height: calc(100% - var(--color-bar-height));
  max-height: 100vh;
`

const Menus = styled('nav')`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`

const Empty = styled('div')`
  flex: 1;
  opacity: 0.7;
  padding: 0 24px;
  color: ${sidebarText};
`

const Footer = styled('div')`
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${sidebarText};
  border-top: 1px solid ${sidebarBorder};
`

interface OpenProps {
  opened: boolean
}

const ToggleBackground = styled('div')`
  content: '';
  display: ${(p: OpenProps) => (p.opened ? 'none' : 'block')};
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
  z-index: 1;
`

const SearchWrapper = styled.div`
  padding: 0 var(--sidebar-padding);
  margin-bottom: 36px;
  ${p =>
    p.theme.docz.mq({
      display: ['block', 'block', 'block', 'none'],
    })};
`

interface SidebarState {
  hidden: boolean
}

interface SidebarProps {
  isDesktop: boolean
}

class SidebarBase extends Component<SidebarProps, SidebarState> {
  public state = {
    hidden: true,
  }

  public componentDidUpdate(pProps: SidebarProps, pState: SidebarState): void {
    const { isDesktop } = this.props
    const { hidden } = this.state

    if (pState.hidden !== this.state.hidden) {
      this.toggleOverlayClass()
    }
    if (pProps.isDesktop !== isDesktop && !hidden && isDesktop) {
      this.setState({ hidden: true })
      this.removeOverlayClass()
    }
  }

  public componentDidMount(): void {
    this.toggleOverlayClass()
  }

  public render(): React.ReactNode {
    const { hidden } = this.state
    const { isDesktop } = this.props

    return (
      <SearchCtxConsumer>
        {({ menus, searching }) => (
          <React.Fragment>
            <Wrapper opened={hidden}>
              <Content>
                <Hamburguer
                  opened={!hidden}
                  onClick={this.handleSidebarToggle}
                />
                <Title />
                <SearchWrapper>
                  <Search />
                </SearchWrapper>

                {menus.length === 0 ? (
                  <Empty>No documents found.</Empty>
                ) : (
                  <Menus>
                    {menus.map(menu => (
                      <Menu
                        key={menu.name}
                        item={menu}
                        sidebarToggle={this.handleSidebarToggle}
                        collapseAll={Boolean(searching)}
                        levels={menu.levels || 0}
                        level={0}
                        isDesktop={isDesktop}
                      />
                    ))}
                  </Menus>
                )}
                <Footer>
                  <Logo showBg={!hidden} />
                </Footer>
              </Content>
            </Wrapper>
            <ToggleBackground
              opened={hidden}
              onClick={this.handleSidebarToggle}
            />
          </React.Fragment>
        )}
      </SearchCtxConsumer>
    )
  }

  private toggleOverlayClass = () => {
    const { isDesktop } = this.props
    const { hidden } = this.state
    const method = !hidden ? this.addOverlayClass : this.removeOverlayClass

    if (window && typeof window !== 'undefined' && !isDesktop) {
      method()
    }
  }

  private removeOverlayClass(): void {
    document.documentElement!.classList.remove('with-overlay')
  }
  private addOverlayClass(): void {
    document.documentElement!.classList.add('with-overlay')
  }
  private handleSidebarToggle = () => {
    if (this.props.isDesktop) return
    this.setState({ hidden: !this.state.hidden })
  }
}

const mapSizesToProps = ({ width }: { width: number }) => ({
  isDesktop: width >= breakpoints.desktop,
})

export const Sidebar = withSizes(mapSizesToProps)(SidebarBase)
