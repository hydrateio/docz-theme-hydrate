import * as React from 'react'
import { SFC } from 'react'
import { Docs, Entry, Link } from 'docz'
import styled from 'react-emotion'
import get from 'lodash/get'

import { get as themeGet } from '@utils/theme'

const Submenu = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 5px 36px 0;
  position: relative;
`

const SmallLink = styled(Link)`
  position: relative;
  font-size: 14px;
  padding: 0 0 5px;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;

  &,
  &:hover,
  &:focus,
  &:visited,
  &.active {
    color: ${themeGet('colors.sidebarText')};
  }

  &.active {
    color: ${themeGet('colors.sidebarActive')};
    opacity: 1;
  }
`

const isSmallLinkActive = (slug: string) => (m: any, location: any) =>
  slug === location.hash.slice(1, Infinity)

const getHeadings = (route: string, docs: Entry[]) => {
  const doc = docs.find(doc => doc.route === route)
  const headings = get(doc, 'headings')

  return headings ? headings.filter(heading => heading.depth === 2) : []
}

interface MenuHeadingsProps {
  route: string
  onClick?: React.MouseEventHandler<any>
}

export const MenuHeadings: SFC<MenuHeadingsProps> = ({ route, onClick }) => (
  <Docs>
    {({ docs }) => {
      const headings = getHeadings(route, docs)

      return (
        headings.length > 0 && (
          <Submenu>
            {headings.map((heading: any) => (
              <SmallLink
                key={heading.slug}
                onClick={onClick}
                to={{ pathname: route, hash: heading.slug }}
                isActive={isSmallLinkActive(heading.slug)}
              >
                {heading.value}
              </SmallLink>
            ))}
          </Submenu>
        )
      )
    }}
  </Docs>
)
