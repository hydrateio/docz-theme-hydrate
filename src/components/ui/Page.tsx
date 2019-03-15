import * as React from 'react'
import { SFC, Fragment } from 'react'
import { PageProps, ThemeConfig } from 'docz'
import lighten from 'polished/lib/color/lighten'
import Edit from 'react-feather/dist/icons/edit-2'
import styled from '@emotion/styled'
import { css } from '@emotion/core'

import { ButtonLink } from './Button'
import { GithubLink, Sidebar, Main } from '../shared'
import { get } from '@utils/theme'
import { Search } from '../shared/Search'

type HydratePageProps = PageProps & {
  doc: {
    fullcontainer?: boolean
  }
}

const Wrapper = styled('div')`
  flex: 1;
  color: ${get('colors.text')};
  background: ${get('colors.background')};
  min-width: 0;
`

const fullContainerStyles = css`
  @media (min-width: 0px) {
    height: 100%;
    max-width: 100%;
    min-height: 100%;
    padding: 0;
    width: 100%;
  }
  & > div {
    height: 100%;
    overflow-y: auto;
  }
`

export const Container = styled('div')`
  box-sizing: border-box;
  margin: 0 auto;
  & h1:first-of-type {
    margin: -40px -40px 0;
  }
  ${(p: HydratePageProps) => p.fullcontainer && fullContainerStyles}
`

const EditPage = styled(ButtonLink.withComponent('a'))`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 2px 8px;
  margin: 8px;
  border-radius: ${get('radii')};
  border: 1px solid ${get('colors.border')};
  opacity: 0.7;
  transition: opacity 0.4s;
  font-size: 14px;
  color: ${get('colors.text')};
  text-decoration: none;
  text-transform: uppercase;

  &:visited {
    color: ${get('colors.text')};
  }

  &:hover {
    opacity: 1;
    background: ${p => lighten(0.1, p.theme.docz.colors.border)};
  }

  ${p =>
    p.theme.docz.mq({
      visibility: ['hidden', 'hidden', 'visible'],
      top: [0, -60, 10],
      right: [0, 0, 32],
    })};
`

const EditIcon = styled(Edit)`
  margin-right: 5px;
`

const Content = styled('div')`
  margin: 40px;
`

const SearchWrapper = styled.div`
  background: #fff;
  padding: 42px 36px 30px;
  & > div {
    width: 50%;
    ${p =>
      p.theme.docz.mq({
        display: ['none', 'none', 'none', 'block'],
      })};
  }
`

export const Page: SFC<HydratePageProps> = ({
  children,
  doc: { link, fullpage, fullcontainer, edit = true, source },
}) => {
  const content = (
    <Fragment>
      {(link || source) && edit && (
        <EditPage href={link || source} target="_blank">
          <EditIcon width={14} /> Edit page
        </EditPage>
      )}
      {children}
    </Fragment>
  )

  return (
    <ThemeConfig>
      {({ repository, ...config }) => (
        <Main config={config}>
          {repository && <GithubLink repository={repository} />}
          {!fullpage && <Sidebar />}
          <Wrapper>
            {fullpage ? (
              content
            ) : (
              <Container fullcontainer={fullcontainer}>
                <SearchWrapper>
                  <Search />
                </SearchWrapper>
                <Content>{content}</Content>
              </Container>
            )}
          </Wrapper>
        </Main>
      )}
    </ThemeConfig>
  )
}
