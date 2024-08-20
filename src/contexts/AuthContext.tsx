import {ReactNode, createContext, useState, useEffect, useContext} from "react"
import {onAuthStateChanged} from "firebase/auth";
import { auth } from "../services/firebase";

type AuthData = {
    signed: boolean;
    loadingAuth: boolean;
    user: UserProps | null;
    handleInfoUser: ({uid,name,email}: UserProps) => void;
}

interface AuthProviderProps{
    children: ReactNode;
}

interface UserProps{
    uid: string;
    name: string | null;
    email:string | null;
}

const AuthContext = createContext({} as AuthData);

export const AuthProvider = ({children}: AuthProviderProps)=>{
    const [user, setUser] = useState<UserProps | null>(null); //signed false
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(()=>{
        const unSub = onAuthStateChanged(auth, (user)=>{
            if(user){
                // tem usuário logado
                setUser({
                    uid: user.uid,
                    name: user?.displayName,
                    email: user?.email
                });
                setLoadingAuth(false);
            }else{
                // não tem usuário logado
                setUser(null);
                setLoadingAuth(false);
            }
        })
        return () => unSub();
    },[])

    const handleInfoUser = ({uid,name,email}:UserProps)=>{
        setUser({
            uid,
            name,
            email,
        });
    }

    return(
        <AuthContext.Provider value={{signed: !!user, loadingAuth, user, handleInfoUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = ():AuthData=>{
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuthContext must be abled within a AuthProvider')
    }
    return context;
}