import React from 'react'
import { Link, ThemeConfig } from 'docz'
import styled from 'react-emotion'

import { get } from '@utils/theme'

const PrimaryColor = get('colors.primary')

const Text = styled('h1')`
  color: ${PrimaryColor};
  font-size: 21px;
  font-weight: bold;
  line-height: 1.38;
  padding: var(--sidebar-padding) var(--sidebar-padding) 30px;
  width: 70%;
`

export const Title = () => (
  <ThemeConfig>
    {props => (
      <Link to="/">
        <Text>{props.title || ''}</Text>
      </Link>
    )}
  </ThemeConfig>
)
