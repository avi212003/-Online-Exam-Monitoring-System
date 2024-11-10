import '../styles/Header.css';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { username } = useAuth();
    return(
        <header className="navbar-header">
            <h1>Online Exam Monitoring System Admin</h1>
            {console.log(username)}
            <span className="navbar-username">Welcome, {username}</span>
        </header>
    )
}

export default Header;