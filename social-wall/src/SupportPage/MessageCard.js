import React, { useState }  from 'react';
import Card from "react-bootstrap/Card";
import { Button, Nav } from 'react-bootstrap'

import './MediaCard.css'

export default function MediaCard(props) {

    const handleResponse = event => props.handleResponse(props.content.id);

  return (
      <div>
        <Card class="cardItem" style={{ width: '38rem' }}>
            <Card.Header>
                <Nav variant="tabs" defaultActiveKey="#first">
                <Nav.Item>
                    <Button className="btn-delete" /* onClick={this.logout} */ >Delete</Button>
                </Nav.Item>
                <Nav.Item>
                    <Button className="btn-important" /* onClick={this.logout} */ >Important</Button>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="#disabled" disabled>
                    Message
                    </Nav.Link>
                </Nav.Item>
                </Nav>
            </Card.Header>
            <Card.Body>
                <Card.Title>{ props.content.title }</Card.Title>
                <Card.Subtitle> by {props.content.user}</Card.Subtitle>
                <Card.Text>
                    {props.content.message}
                </Card.Text>
                <Button className="btn-card" onClick={handleResponse}>Responde</Button>
            </Card.Body>
		</Card>
        <br />
        <br />
    </div>
  );
}
