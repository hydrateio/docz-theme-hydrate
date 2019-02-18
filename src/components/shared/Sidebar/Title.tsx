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
  margin: 0;
  padding-left: var(--sidebar-padding);
  padding-right: var(--sidebar-padding);
  width: 70%;

  ${p =>
    p.theme.docz.mq({
      paddingTop: ['0', '0', '20px'],
      paddingBottom: ['10px', '10px', '30px'],
    })};
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
