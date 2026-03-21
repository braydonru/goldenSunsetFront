import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import App from "./App";

import './style.min.css'
import './owl.carousel.min.css'
import './style.css'

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_51TCoszFO4jwZ331rvQsQIGtnjWjJHV20NdR8FNaGYTOLz0xW0SsAOBcOBltsN5Kzsxu1uVq5Hw6jPxrUe5QaDffw00sJ55p7Bp');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Elements stripe={stripePromise}>
                <App/>
            </Elements>
        </BrowserRouter>
    </React.StrictMode>,
)