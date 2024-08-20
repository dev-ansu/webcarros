import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Logo from "../../components/Logo";
import { useForm } from "react-hook-form";
import Input from "../../components/Input/indext";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginData, loginSchemaValidation } from "../../schemas/loginSchemaValidation";
import {auth} from "../../services/firebase";
import {signInWithEmailAndPassword, signOut} from "firebase/auth"
import { toast } from "react-toastify";
import Button from "../../components/Button";

const Login = ()=>{
    
    const {handleSubmit, register, formState:{ errors }} = useForm<LoginData>({
        mode:"onChange",
        resolver: zodResolver(loginSchemaValidation),
    });
    const navigate = useNavigate();

    useEffect(()=>{
        const handleLogout = async()=>{
            await signOut(auth);
        }
        handleLogout();
    },[]);

    const onSubmit = async (data: LoginData)=>{
        try{
            const user = await signInWithEmailAndPassword(auth, data.email, data.password);
            console.log(user);
            toast.success("Usuário logado com sucesso.");
            navigate("/dashboard");
        }catch(err: unknown){
            const errorString: string = String(err);
            console.error(err);
            if(errorString.includes("invalid-credentia")){
                toast.warning("Credenciais inválidas. Tente novamente!")
                return;
            }
            toast.error("Houve um erro na autenticação.")
        }     
    }



    return (
        <Container>
            <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
                <Link to="/" className="mb-6 flex justify-center max-w-sm w-full"><Logo /></Link>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 bg-white max-w-xl w-full rounded-lg">
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-lg" htmlFor="email">Email</label>
                        <Input 
                            aria-label="Campo de e-mail"
                            autoFocus
                            id="email"
                            register={register('email')}
                            type="email"
                            placeholder="Digite seu e-mail"
                            error={errors.email?.message}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-lg" htmlFor="password">Senha</label>
                        <Input 
                            aria-label="Campo de senha"
                            id="password"
                            register={register('password')}
                            type="password"
                            placeholder="Digite seu e-mail"
                            error={errors.password?.message}
                        />
                    </div>
                    <Button text="Acessar" />

                </form>

                <p>
                    Não possui uma conta ainda? <Link aria-label="Cadastre-se aqui" className="text-blue-400" to="/register"> Cadastre-se aqui!</Link>
                </p>

            </div>
        </Container>
    )
}

export default Login;