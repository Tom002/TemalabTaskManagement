import React from "react";
import { Container, Header, Button } from "semantic-ui-react";

const HomePage = () => {
  return (
    <Container text>
      <Header
        as="h1"
        content="Task management"
        style={{
          fontSize: "4em",
          fontWeight: "normal",
          marginTop: "3em"
        }}
      />
      <Button href="/tasks" primary size="huge">
        Get Started
      </Button>
    </Container>
  );
};

export default HomePage;
