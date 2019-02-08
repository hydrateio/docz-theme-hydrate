# docz-theme-hydrate

Hydrate theme for [docz](https://docz.site)

![](https://cdn-std.dprcdn.net/files/acc_649651/xZt5zr)

This theme extends the default docz theme, [docz-theme-default](https://github.com/pedronauck/docz/tree/master/packages/docz-theme-default) to allow for an additional set of features.

## Nested Menus

To extend beyond docz's single menu level restriction, simply pass an array to the `menu` frontmatter in your mdx files.

```js
---
name: Example
menu: ['First', 'Second', 'Third']
---
```

## External Links

To add an external link in the left navigation, add an `.mdx` file with the following metadata at the top.

```md
---
name: <Link Title>
menu: <Parent Menu>
type: external-link
href: http://example.com
---
```

## Hidden Pages

If you want to create `.mdx` files that can be imported into other pages but not appear as pages within docz's left navigation sidebar, then add the following metadata to the top of the file.

```md
---
routable: false
---
```

The page will still be available as an import to other pages but it will not appear in the site navigation.

### More to come.