import logo from '../assets/LOGO.svg'
import '../styles/Header.css'

function Header() {
    return (
        <div className='kasa-header'>
            <img src={logo} alt='Kasa'></img>
            <div className='kasa-header_nav'>
                <a href='#'>Accueil</a>
                <a href='#'>A Propos</a>
            </div>
        </div>
    )
}

export default Header