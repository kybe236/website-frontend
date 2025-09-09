import "./Root.css"
import {Link} from "react-router";

function Root() {
    return (
        <div className="main-container" style={{width: "80%"}}>
            <div className="split-container">
                <div className="left-side">
                    <h1>2kybe3</h1>
                    <ul>
                        <li>I'm 16y old</li>
                        <li>I use arch btw</li>
                        <li>I speak German and English</li>
                        <li>I love coding</li>
                    </ul>
                </div>
                <div className="divider"></div>
                <div className="right-side">
                    <Link to="/crypto" className="nav-link">KybeCrypt</Link>
                    <Link to="/beta" className="nav-link">Beta</Link>
                    <Link to="/mcdimensions" className="nav-link">MCDimensions</Link>
                    <Link to="/dotfiles" className="nav-link">DotFiles</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                    <a href="https://github.com/kybe236" className="nav-link" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a href="https://github.com/kybe236/website-frontend" className="nav-link" target="_blank" rel="noopener noreferrer">
                        Source Code
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Root;