import * as React from 'react'
import { FC, forwardRef } from 'react'
import styled from '@emotion/styled'
import { Link as BaseLink } from 'docz'

import { get } from '@utils/theme'

export const LinkStyled = styled('a')`
  &,
  &:visited,
  &:active {
    text-decoration: none;
    color: ${get('colors.link')};
  }

  &:hover {
    color: ${get('colors.link')};
  }
`

type LinkProps = React.AnchorHTMLAttributes<any>

const StyledBaseLink = LinkStyled.withComponent(BaseLink)

export const Link: FC<LinkProps> = ({ href, innerRef, ...props }) => {
  const isInternal = href && href.startsWith('/')

  return isInternal ? (
    <StyledBaseLink ref={innerRef} {...props} to={href} />
  ) : (
    <LinkStyled ref={innerRef} {...props} href={href} />
  )
}
