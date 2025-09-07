import "./Root.css"
import {Link} from "react-router";

function Root() {
    return (
        <div className="main-container">
            <div className="split-container">
                <div className="left-side">
                    <h2>2kybe3</h2>
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
                    <a href="https://github.com/kybe236" className="nav-link" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a href="https://kybe.xyz/dc" className="nav-link" target="_blank" rel="noopener noreferrer">
                        Discord
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Root;