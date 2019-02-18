import * as React from 'react'
import { Component } from 'react'
import { injectGlobal } from 'emotion'
import styled from 'react-emotion'
import get from 'lodash/get'
import { get as themeGet } from '@utils/theme'
import { SearchCtxProvider } from '../Search/SearchContext'

const primaryColor = themeGet('colors.primary')

const Wrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  max-width: 100vw;
  min-height: calc(100% - var(--color-bar-height));
  padding-top: var(--color-bar-height);
  &:before {
    background: ${primaryColor};
    content: '';
    left: 0;
    height: var(--color-bar-height);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 3;
  }
`

interface MainProps {
  config: any
}

const base = (body: any) =>
  injectGlobal`
    :root {
      --color-bar-height: calc(30rem / 16);
      --sidebar-width: 260px;
      --sidebar-padding: 20px;
    }
    html {
      font-size: 16px;
    }
    body {
      ${body};
    }
  `

export class Main extends Component<MainProps> {
  public componentDidUpdate(prevProps: MainProps): void {
    const body = this.getBody(this.props)
    const prevBody = this.getBody(prevProps)

    if (body && prevBody !== body) base(body)
  }

  public componentDidMount(): void {
    base(this.getBody(this.props))
  }

  public render(): React.ReactNode {
    return (
      <SearchCtxProvider>
        <Wrapper>{this.props.children}</Wrapper>
      </SearchCtxProvider>
    )
  }

  private getBody(props: MainProps): any {
    return get(props, 'config.themeConfig.styles.body')
  }
}
