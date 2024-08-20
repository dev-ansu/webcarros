import { Link } from "react-router-dom";
import {FiUser, FiLogIn} from "react-icons/fi"
import Logo from "../Logo";
import { useAuthContext } from "../../contexts/AuthContext";

const Header = ()=>{
    const {signed, loadingAuth} = useAuthContext();
    
    return(
        <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
            <header className="w-full max-w-7xl flex items-center justify-between px-4 mx-auto">
                <Link to="/">
                    <Logo />
                </Link>
                {!loadingAuth && signed &&
                <Link to="/dashboard">
                    <div className="border-2 rounded-full p-1 border-gray-900">
                        <FiUser size={22} color="#000" />
                    </div>
                </Link>
                }
                {!loadingAuth && !signed &&
                <Link to="/login">
                    <FiLogIn size={22} color="#000" />
                </Link>
                }
            </header>
        </div>
    )
}

export default Header; 