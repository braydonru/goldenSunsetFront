import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import App from "./App";

import './style.min.css'
import './owl.carousel.min.css'
import './style.css'

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_51T992zAA6IgswBLii5slRwThFBnR9LQqYj74Mtd1KgQm9OGuPhcmFK40DFaWTXRqMv4csCt8CnE8Yqa1mtsXNtE1001yMAz4M6');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Elements stripe={stripePromise}>
                <App/>
            </Elements>
        </BrowserRouter>
    </React.StrictMode>,
)