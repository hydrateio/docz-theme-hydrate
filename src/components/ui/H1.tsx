import styled from 'react-emotion'
import { get } from '@utils/theme'

export const H1 = styled('h1')`
  position: relative;
  display: table;
  margin: 30px 0;
  ${p => p.theme.docz.mq(p.theme.docz.styles.h1)};
`
