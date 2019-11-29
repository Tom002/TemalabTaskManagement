import React from 'react'
import { Container, Header, Button } from 'semantic-ui-react'

const HomePage = () => {
    return (
            <Container text>
              <Header
                as='h1'
                content='Task management'
                
                style={{
                  fontSize: '4em',
                  fontWeight: 'normal',
                  marginBottom: 0,
                  marginTop: '3em',
                }}
              />
              <Header
                as='h2'
                content='Do whatever you want when you want to.'
                
                style={{
                  fontSize: '1.7em',
                  fontWeight: 'normal',
                  marginTop: '1.5em',
                }}
              />
              <Button href="/tasks" primary size='huge'>
                Get Started
                
              </Button>
            </Container>
          )
}

export default HomePage