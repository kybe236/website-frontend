import "./Contact.css";

function Contact() {
    const contacts = [
        { label: "Email", href: "mailto:kybe@kybe.xyz", text: "kybe@kybe.xyz" },
        { label: "Discord", href: "https://kybe.xyz/dc", text: "server" },
        { label: "Discord", href: "https://discord.com/users/921066050009833572", text: "2kybe3" },
    ];

    return (
        <div className="main-container">
            <h1>Contact Me</h1>
            <div className="contact-content">
                <ul className="contact-list">
                    {contacts.map(({ label, href, text }, index) => (
                        <li key={index}>
                            {label}:{" "}
                            <a
                                href={href}
                                className="link"
                                target={href.startsWith("http") ? "_blank" : undefined}
                                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                            >
                                {text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Contact;