import { Container } from '@chakra-ui/react'

const Layout = ({ children }) => (
  <Container centerContent p={3}>
    {children}
  </Container>
)

export default Layout
