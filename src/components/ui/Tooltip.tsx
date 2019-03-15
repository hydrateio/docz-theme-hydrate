import * as React from 'react'
import { SFC, ReactNode } from 'react'
import { ThemeConfig } from 'docz'
import BaseTooltip from 'rc-tooltip'
import styled from '@emotion/styled'
import { css } from 'emotion'

import { get } from '@utils/theme'

interface TooltipProps {
  text: ReactNode
  children: ReactNode
}

const overlayClass = (colors: Record<string, any>) => css`
  .rc-tooltip-inner {
    background: ${colors.tooltipBg};
    color: ${colors.tooltipColor};
  }

  .rc-tooltip-arrow {
    border-top-color: ${colors.tooltipBg};
  }
`

const Link = styled('a')`
  text-decoration: none;
  color: ${get('colors.primary')};
`

export const Tooltip: SFC<TooltipProps> = ({ text, children }) => (
  <ThemeConfig>
    {config => (
      <BaseTooltip
        placement="top"
        trigger={['hover']}
        overlay={text}
        overlayClassName={overlayClass(config.themeConfig.colors)}
      >
        <Link href="#" onClick={(ev: any) => ev.preventDefault()}>
          {children}
        </Link>
      </BaseTooltip>
    )}
  </ThemeConfig>
)
