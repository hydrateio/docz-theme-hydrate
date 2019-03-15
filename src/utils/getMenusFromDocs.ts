import { Entry } from 'docz'
import sort from 'array-sort'
import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'

export interface Menu {
  name: string
  items: Entry[]
  menus: Menu[]
  route?: string
  levels?: number
  order: number
  type?: string
  icon?: string
}

export type Menus = Array<Entry | Menu>

const sortByDelimiter = (delimiter: string) => (a: string, b: string) => {
  const splitA = a.split(delimiter).length - 1
  const splitB = b.split(delimiter).length - 1

  if (splitA < splitB) {
    return -1
  }
  if (splitA > splitB) {
    return 1
  }
  return 0
}

const sortByOrder = (a: Menu, b: Menu) => {
  const orderA = a.order
  const orderB = b.order

  if (orderA < orderB || (orderA > orderB && orderB === 0)) {
    return -1
  }
  if (orderA > orderB || (orderA < orderB && orderA === 0)) {
    return 1
  }
  return 0
}

const getMenusFromDocs = (docs: Entry[], menuConfig: string[]): Menus => {
  const uniqueMenus: { [key: string]: Menu } = {}
  const delimiter = '__'
  const rootItems: Entry[] = []

  docs.forEach(doc => {
    const menu = Array.isArray(doc.menu) ? doc.menu.join(delimiter) : doc.menu

    if (menu) {
      if (!Object.keys(uniqueMenus).includes(menu)) {
        uniqueMenus[menu] = {
          name: menu.split(delimiter).pop() || '',
          items: [doc],
          menus: [],
          order: 0,
        }
      } else {
        uniqueMenus[menu].items.push(doc)
      }
    } else if (doc.routable === false) {
      // ignore non-routable documents
    } else {
      rootItems.push(doc)
      sort(rootItems, 'name')
    }
  })

  const nestedMenus: string[] = Object.keys(uniqueMenus).reduce(
    (acc: string[], menu: string) => {
      if (menu.indexOf(delimiter) > -1) {
        acc.push(menu)
      }
      return acc
    },
    []
  )

  sort(nestedMenus, sortByDelimiter(delimiter))

  nestedMenus.forEach(nestedMenu => {
    const splitNestedMenu = nestedMenu.split(delimiter)
    let menuPath = ''

    splitNestedMenu.forEach((menuName, index) => {
      menuPath = menuPath ? `${menuPath}.menus` : menuName

      const parentMenu = get(uniqueMenus, menuPath)
      if (Array.isArray(parentMenu)) {
        const menuIndex = Math.max(
          0,
          parentMenu.findIndex(menu => {
            return Boolean(menu && menu.name === menuName)
          })
        )
        const currentMenuPath = `${menuPath}[${menuIndex}]`
        const currentMenu = get(uniqueMenus, currentMenuPath)

        if (!currentMenu || parentMenu.length > 0) {
          if (!currentMenu) {
            set(uniqueMenus, currentMenuPath, {
              name: menuName,
              items: [],
              menus: [],
              order: 0,
            })
            const uniqueMenu = uniqueMenus[splitNestedMenu[0]]
            uniqueMenu.levels =
              uniqueMenu.levels && uniqueMenu.levels > 0
                ? uniqueMenu.levels + 1
                : 1
          }

          if (index + 1 === splitNestedMenu.length) {
            const keyedMenu = get(uniqueMenus, nestedMenu)

            if (currentMenu && parentMenu.length > 0) {
              parentMenu.push(keyedMenu)
              sort(parentMenu, 'name')
            } else {
              set(uniqueMenus, currentMenuPath, keyedMenu)
            }
          }
        }

        menuPath = currentMenuPath
      } else if (!parentMenu) {
        set(uniqueMenus, menuPath, {
          name: menuName,
          menus: [],
          order: 0,
          id: `${menuName}Menu`,
          items: [],
        })
      }
    })

    unset(uniqueMenus, nestedMenu)
  })

  const menus: Menu[] = Object.keys(uniqueMenus).map(menu => ({
    ...uniqueMenus[menu],
    name: menu,
  }))

  const menuArray = new Array().concat(menus, rootItems)

  // sort by menuConfig from doczrc.js if it exists. Fallback to alphabetical ordering
  // if no custom menu order is provided
  if (Array.isArray(menuConfig)) {
    return menuConfig.map(x => menuArray.find(item => item.name === x)).filter(Boolean);
  }

  sort(menuArray, sortByOrder, 'name')

  return menuArray
}

export { getMenusFromDocs }
