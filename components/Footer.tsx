import { Instagram, LinkedinIcon, Twitter } from "lucide-react";
import Link from "next/link";


const Footer = () => {
    return (
        <footer id="footer">
            <div className="wrapper">
                <div>
                    <ul>
                        <h3>Empresa</h3>
                        <Link href="#">Contato</Link>
                        <Link href="#">Parceiros</Link>
                    </ul>
                    <ul>
                        <h3>Politicas</h3>
                        <Link href="#">Termos de Uso</Link>
                        <Link href="#">Política de Privacidade</Link>
                        <Link href="#">FAQ</Link>
                    </ul>
                    <ul>
                        <h3>Redes Sociais</h3>
                        <li>
                            <Link href="#">Blog</Link>
                        </li>
                        <li className="link-icon-flx-rw">
                            <Link href="#"> Twitter </Link>
                            <Twitter></Twitter>
                        </li>
                        <li className="link-icon-flx-rw">
                            <Link href="#"> Instagram </Link>
                            <Instagram></Instagram>
                        </li>
                        <li className="link-icon-flx-rw">
                            <Link href="#"> LinkedIn </Link>
                            <LinkedinIcon></LinkedinIcon>
                        </li>
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