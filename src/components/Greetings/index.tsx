import { Button } from '../Button'
import { Container, Image, Text } from './styles'

export function Greetings() {
  function handleSayHello() {
    window.Main.run();
  }

  return (
    <Container>
      <Image
        src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
        alt="ReactJS logo"
      />
      <Text>An Electron boilerplate including TypeScript, React, Jest and ESLint.</Text>
      <Button onClick={handleSayHello}>Send message to main process</Button>
    </Container>
  )
}
 
