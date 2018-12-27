import React from 'react'
import styled from 'react-emotion'
import { Entry } from 'docz'
import sort from 'array-sort'

import { Menu, MenuProps } from './Menu'
import { MenuLink } from './MenuLink'
import { get } from '@utils/theme'
import { Menu as MenuType } from '@utils/getMenusFromDocs'

interface SubMenuProps {
  hovered?: boolean
  menuPosition?: { top: number, left: number }
  onMouseEnter?: (ev: React.SyntheticEvent<any>) => void,
  onMouseLeave?: (ev: React.SyntheticEvent<any>) => void,
  show: boolean
}

interface OpenedProps {
  opened: boolean
}

interface WrapperProps {
  onMouseEnter?: (ev: React.SyntheticEvent<any>) => void
  onMouseLeave?: (ev: React.SyntheticEvent<any>) => void
  show: boolean
}

const sidebarBg = get('colors.sidebarBg')

const Wrapper = styled('div')`
  position: ${(p: WrapperProps) => p.show ? 'static' : 'fixed'};
  z-index: 999;
`

const List = styled('dl')`
  background: ${sidebarBg};
  flex: 1;
  overflow-y: auto;
  visibility: ${(p: OpenedProps) => (p.opened ? 'visible' : 'hidden')};
  max-height: ${(p: OpenedProps) => (p.opened ? 'none' : '0px')};
`

export const SubMenu = (props: SubMenuProps & MenuProps) => {
  const { collapseAll, hovered, item, level, levels, menuPosition, onMouseEnter, onMouseLeave, show, sidebarToggle, isDesktop } = props;

  const mouseEvents = {
    onMouseEnter,
    onMouseLeave
  }

  const menuItems = new Array().concat(item.items, item.menus)

  sort(menuItems, ['order', 'name'])

  return (
    <Wrapper
      {...hovered && { ...mouseEvents }}
      show={show}
      style={{ ...(menuPosition || {}) }}>
      <List opened={hovered || show}>
        {menuItems &&
          menuItems.map((item: Entry) => {
            if (item.id) {
              return (
                <dt key={item.id}>
                  <MenuLink
                    item={item}
                    onClick={sidebarToggle}
                    isItem={true}
                  >
                    {item.name}
                  </MenuLink>
                </dt>
              )
            }
            return (
              <dt key={item.name}>
                <Menu
                  key={item.name}
                  sidebarToggle={sidebarToggle}
                  item={item}
                  collapseAll={collapseAll}
                  level={level + 1}
                  levels={levels}
                  isDesktop={isDesktop}
                >
                  {item.name}
                </Menu>
              </dt>
            )
          })}
      </List>
    </Wrapper>
  )
}
