import {signOut} from "firebase/auth";
import { Link } from "react-router-dom";
import {FiLogOut} from "react-icons/fi"
import { MouseEvent } from "react";
import { auth } from "../../services/firebase";

const PainelHeader = ()=>{

    const handleLogout = async(e: MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        await signOut(auth);
    }
    
    return (
        <div className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium gap-4 px-4 mb-4">
            <Link className="hover:text-slate-100 font-medium transition-all" aria-label="ir para dashboard" to="/dashboard">Dashboard</Link>
            <Link className="hover:text-slate-100 font-medium transition-all" aria-label="ir para página de novo carro" to="/dashboard/new">Novo carro</Link>
            <button className="ml-auto" aria-label="Botão de logout/sair" type="button" onClick={handleLogout}>
                <FiLogOut size={24} color="#fff" />                
            </button>
        </div>
    )
}

export default PainelHeader;