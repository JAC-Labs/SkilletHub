import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import { Nav, NavItem } from 'react-bootstrap';


class NavBar extends React.Component {
  // TODO: Implement conditional render that displays different NavBar for authenticated/unauthenticated users. 

  handleSelect(selectedKey) {
    alert('selected ' + selectedKey);
  }

  render() {
    return (
      <Nav className='NavBar' bsStyle="tabs" onSelect={this.handleSelect.bind(this)}>
        <NavItem eventKey={1} href="/Create">Testing Create</NavItem>
        <Link to='/SignUp'> Sign Up </Link>
        <Link to='/User' className='NavBarElement'> Profile </Link>
        <Link to='/Recipe' className='NavBarElement'> Recipe </Link>
        <Link to='/Create' className='NavBarElement'> Create Recipe </Link>
      </Nav>
    ); 
  }
}

export default NavBar;