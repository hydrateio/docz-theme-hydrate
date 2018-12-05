import { Entry } from 'docz'
import sort from 'array-sort'
import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'

export interface Menu {
  name: string,
  items: Entry[],
  menus: Entry[]
}

const sortByDelimiter = (delimiter: string) => (a: string, b: string) => {
  const splitA = a.split(delimiter).length - 1;
  const splitB = b.split(delimiter).length - 1;

  if (splitA < splitB) {
    return -1
  }
  if (splitA > splitB) {
    return 1
  }
  return 0
}

const getMenusFromDocs = (docs: Entry[]) => {
  const uniqueMenus: { [key: string]: Menu } = {}
  const delimiter = '__'

  docs.forEach(doc => {
    const menu = Array.isArray(doc.menu) ? doc.menu.join(delimiter) : doc.menu

    if (menu) {
      if (!Object.keys(uniqueMenus).includes(menu)) {
        uniqueMenus[menu] = { name: menu.split(delimiter).pop(), items: [doc], menus: [] }
      } else {
        uniqueMenus[menu].items.push(doc)
      }
    }
  })

  const nestedMenus: string[] = Object.keys(uniqueMenus).reduce((acc: string[], menu: string) => {
    if (menu.indexOf(delimiter) > -1) {
      acc.push(menu)
    }
    return acc
  }, [])

  sort(nestedMenus, sortByDelimiter(delimiter))

  nestedMenus.forEach((nestedMenu) => {
    const splitNestedMenu = nestedMenu.split(delimiter)
    let menuPath = ''

    splitNestedMenu.forEach((menuName, index) => {
      menuPath = menuPath ? `${menuPath}.menus` : menuName

      const parentMenu = get(uniqueMenus, menuPath)
      if (Array.isArray(parentMenu)) {
        const menuIndex = Math.max(0, parentMenu.findIndex(menu => {
          return Boolean(menu && menu.name === menuName)
        }))
        const currentMenuPath = `${menuPath}[${menuIndex}]`
        const currentMenu = get(uniqueMenus, currentMenuPath)

        if (!currentMenu || parentMenu.length > 0) {
          if (!currentMenu) {
            set(uniqueMenus, currentMenuPath, { name: menuName, items: [], menus: [] })
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
        set(uniqueMenus, menuPath, { name: menuName, menus: [] })
      }
    })

    unset(uniqueMenus, nestedMenu)
  })

  const array = Object.keys(uniqueMenus).map(menu => ({
    ...uniqueMenus[menu],
    name: menu
  }))
  return array
}

export { getMenusFromDocs }