import * as React from 'react'
import { SFC } from 'react'
import styled from 'react-emotion'
import SearchIcon from 'react-feather/dist/icons/search'
import placeholder from 'polished/lib/mixins/placeholder'
import rgba from 'polished/lib/color/rgba'

import { get } from '@utils/theme'

const sidebarBorder = get('colors.sidebarBorder')
const sidebarText = get('colors.sidebarText')

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  padding: 0 36px 20px;
  opacity: 1;
`

const Icon = styled(SearchIcon)`
  stroke: ${sidebarText};
  width: 20px;
  opacity: 0.5;
`

const Field = styled('div')`
  border: 1px solid ${p => rgba(sidebarText(p), 0.3)};
  box-shadow: 0 0px 2px ${p => rgba(sidebarText(p), 0.1)};
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex-basis: 100%;
  padding-right: 10px;
`

const Input = styled('input')`
  outline: none;
  width: 100%;
  padding: 10px 5px 10px 20px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: ${sidebarText};

  ${p =>
    placeholder({
      color: rgba(sidebarText(p), 0.5)
    })};
`

interface SearchProps {
  onSearch: (value: string) => void
}

export const Search: SFC<SearchProps> = ({ onSearch }) => (
  <Wrapper>
    <Field>
      <Input
        type="text"
        placeholder="Search..."
        onChange={(ev: any) => {
          onSearch && onSearch(ev.target.value)
        }}
      />
      <Icon />
    </Field>
  </Wrapper>
)
