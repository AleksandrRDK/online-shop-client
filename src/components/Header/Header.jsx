import { NavLink } from 'react-router-dom';
import './Header.scss';

function Header() {
    return (
        <header className="header__section">
            <div className="container">
                <div className="header">
                    <div className="header__logo">shop</div>
                    <nav className="header__nav">
                        <ul className="header__list">
                            <li className="header__item">
                                <NavLink
                                    to="/catalog"
                                    className={({ isActive }) =>
                                        `header__link ${
                                            isActive
                                                ? 'header__link--active'
                                                : ''
                                        }`
                                    }
                                >
                                    Каталог
                                </NavLink>
                            </li>
                            <li className="header__item">
                                <NavLink
                                    to="/cart"
                                    className={({ isActive }) =>
                                        `header__link ${
                                            isActive
                                                ? 'header__link--active'
                                                : ''
                                        }`
                                    }
                                >
                                    Корзина
                                </NavLink>
                            </li>
                            <li className="header__item">
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        `header__link ${
                                            isActive
                                                ? 'header__link--active'
                                                : ''
                                        }`
                                    }
                                >
                                    Профиль
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
