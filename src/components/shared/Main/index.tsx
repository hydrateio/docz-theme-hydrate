import * as React from 'react'
import { FC } from 'react'
import styled from '@emotion/styled'
import { Global, css } from '@emotion/core'

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

const base = (body: any) => css`
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

export const Main: FC<MainProps> = props => (
  <SearchCtxProvider menuConfig={props.config.menu}>
    <Wrapper>
      <Global styles={base(get(props, 'config.themeConfig.styles.body'))} />
      {props.children}
    </Wrapper>
  </SearchCtxProvider>
)
