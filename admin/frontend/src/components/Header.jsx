import '../styles/Header.css';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { firstname } = useAuth();
    return(
        <header className="navbar-header">
            <h1>Online Exam Monitoring System Admin</h1>
            {/* {console.log(firstname)} */}
            <span className="navbar-username">Welcome, {firstname}</span>
        </header>
    )
}

export default Header;