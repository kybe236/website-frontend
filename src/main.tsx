import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router";
import Root from "./paths/root/Root.tsx";
import Crypto from "./paths/crypto/Crypto.tsx";
import Beta from "./paths/beta/Beta.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div
            className="center"
            style={{
                backgroundImage: `url('/img.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "100vh",
            }}
        >
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Root/>}/>
                    <Route path="/crypto" element={<Crypto/>}/>
                    <Route path="/beta" element={<Beta />} />
                </Routes>
            </BrowserRouter>
        </div>
    </StrictMode>,
)
