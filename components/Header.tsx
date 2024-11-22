'use client'
import Link from "next/link";
import { useAuth } from "context/AuthProvider";

const Header = () => {

    const { isAuth } = useAuth()

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
                        {
                            !isAuth && (
                                <li>
                                    <Link href="/login">Login</Link>
                                </li>
                            )
                        }
                        {
                            isAuth && (
                                <li>
                                    <Link href="/dashboard">Dashboard</Link>
                                </li>
                            )
                        }
                    </ul>
                </nav>

            </div>
        </header>
    );
}

export default Header;