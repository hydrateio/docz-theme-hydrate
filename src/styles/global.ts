import { css } from '@emotion/core'
import 'codemirror/lib/codemirror.css'

// tslint:disable
export const globalStyle = css`
  .icon-link {
    display: none;
  }

  body {
    margin: 0;
    padding: 0;
  }

  .with-overlay {
    overflow: hidden;
  }

  html, body, #root {
    height: 100%;
    min-height: 100%;
  }
`
