import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import App from "./App";

import './style.min.css'
import './owl.carousel.min.css'
import './style.css'

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_live_51T992tAbihs8G1nPjNkr6MEon7QXuLo4HEfoy98zudrnyOb1GUMsviY772FP35Ul5lLT4nVVShtgfAVWnvNIKaXf00XXaKj2aL');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Elements stripe={stripePromise}>
                <App/>
            </Elements>
        </BrowserRouter>
    </React.StrictMode>,
)