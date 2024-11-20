import Link from "next/link";

const Header = () => {
    return (
        <header id="header">
            <div className="wrapper">

                <div className="logo">
                    <Link href="/">
                        <img src="/img/logo.jpeg" alt="Logo" />
                    </Link>
                </div>

                <nav>
                    <ul>
                        <li>
                            <Link href="/mapa">Mapa</Link>
                        </li>
                        <li>
                            <Link href="/login">Login</Link>
                        </li>
                    </ul>
                </nav>
                
            </div>
        </header>
        );
}

export default Header;