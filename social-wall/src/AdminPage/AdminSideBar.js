import React from 'react'
import { Button } from 'react-bootstrap'

import './sidebar.css'

function Sidebar({ items }) {
  return (
    <nav class="col-md-2 d-none d-md-block bg-light sidebar">
        <div class="sidebar-sticky">
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span>Dashboard</span>
            </h6>
            <ul class="nav flex-column mb-2">
                { items }
            </ul>
        </div>
    </nav>
  )
}

export default Sidebar