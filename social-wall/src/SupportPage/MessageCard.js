import React, { useState }  from 'react';
import Card from "react-bootstrap/Card";
import { Button, Nav } from 'react-bootstrap'
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';

import './MediaCard.css'

export default function MediaCard(props) {
    const [resolved, setResolved] = useState(props.content.resolved);
    const [important, setImportant] = useState(props.content.important);

    const handleResponse = event => {
        setResolved(true);
        props.handleResponse(props.content.id);
    }

    const handleDelete = event => props.handleDelete(props.content.id);
    const handleSetImportant = event => props.handleSetImportant(props.content.id);

  return (
      <div>
        <Card class="cardItem" style={{ width: '38rem' }}>
            <Card.Header className={'card-header-' + props.content.header}>
                <Nav variant="tabs" defaultActiveKey="#first">
                <Nav.Item>
                    <Button className={"btn-delete-" + props.content.header} onClick={handleDelete}>Delete</Button>
                </Nav.Item>
                <Nav.Item>
                    <Button className={"btn-important-" + props.content.header} onClick={handleSetImportant} >Important</Button>
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
                <Button className={"btn-card-" + props.content.header}  onClick={handleResponse}>Responde</Button>
                {resolved &&
                    <a class="orange-text d-flex flex-row-reverse p-2">
                        <h5 class="waves-effect waves-light">Resolved    <ThumbUpIcon/></h5>
                    </a>
                }
                {important &&
                    <a class="orange-text d-flex flex-row-reverse p-2">
                        <h5 class="waves-effect waves-light">Important!    <NotificationImportantIcon/></h5>
                    </a>
                }
            </Card.Body>
		</Card>
        <br />
        <br />
    </div>
  );
}
