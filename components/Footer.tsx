import Link from "next/link";

const Footer = () => {
    return (
        <footer id="footer">
            <div className="wrapper">
                <div id="container-links">
                    <ul>
                        <h3>Empresa</h3>
                        <Link href="#">Contato</Link>
                        <Link href="#">Parceiros</Link>
                        <Link href="/time">Nosso Time</Link>
                    </ul>
                    <ul>
                        <h3>Politicas</h3>
                        <Link href="#">Termos de Uso</Link>
                        <Link href="#">Política de Privacidade</Link>
                        <Link href="#">FAQ</Link>
                    </ul>
                    <ul>
                        <h3>Redes Sociais</h3>
                        <Link href="#">Blog</Link>
                        <Link href="#"> Twitter </Link>
                        <Link href="#"> Instagram </Link>
                        <Link href="#"> LinkedIn </Link>
                    </ul>
                </div>
            </div>
            <p>
                © 2024 Energia Solar Pública. Todos os direitos reservados.
            </p>
        </footer>
    );
}

export default Footer;