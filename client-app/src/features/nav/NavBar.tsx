import React from 'react'
import {Menu, Container} from 'semantic-ui-react'
import {NavLink} from 'react-router-dom';

const NavBar = () => {
    return (
      <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          Task Management
        </Menu.Item>
        <Menu.Item
          name="Tasks"
          as={NavLink}
          exact
          to='/tasks'
        />
        <Menu.Item
          name='Modify Priority'
          as={NavLink}
          exact
          to='/tasks/priority'
        />
        <Menu.Item
          content='Add Task'
          as={NavLink}
          to='/createTask'
        />
        <Menu.Item
          content='Add Status'
          to={'/createState'}
          as={NavLink}
        />
      </Container>
    </Menu>
    )
}

export default NavBar
