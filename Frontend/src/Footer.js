const Footer = () => {
    return (
        <footer className="p-2 text-center">
            <p style={{ margin: '0px' }}>Copyright © {new Date().getFullYear()} The Dayton Leader - All Rights Reserved.</p>
            <div>
                <a
                    href="https://www.facebook.com/daytonleader"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="me-3"
                    style={{ color: '#570335' }}
                >
                    <i class="bi bi-facebook fs-3"></i>
                </a>
                <a
                    href="https://www.instagram.com/daytonleader/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="me-3"
                    style={{ color: '#570335' }}
                >
                    <i class="bi bi-instagram fs-3"></i>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
