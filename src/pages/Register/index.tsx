import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import Logo from "../../components/Logo";
import { useForm } from "react-hook-form";
import Input from "../../components/Input/indext";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchemaValidation, RegisterData } from "../../schemas/registerSchemaValidation";
import {auth} from "../../services/firebase";
import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import Button from "../../components/Button";

const Register = ()=>{
    const {handleInfoUser} = useAuthContext();
    const {handleSubmit, register, formState:{ errors }, reset} = useForm<RegisterData>({
        mode:"onChange",
        resolver: zodResolver(registerSchemaValidation),
    });
    const navigate = useNavigate();

    useEffect(()=>{
        const handleLogout = async()=>{
            await signOut(auth);
        }
        handleLogout();
    },[]);

    
    const onSubmit = async (data: RegisterData)=>{
    
         try{
            const userRef = await createUserWithEmailAndPassword(auth, data.email, data.password);

            if(userRef.user){
                await updateProfile(userRef.user, {
                    displayName: data.name,
                });
                
                handleInfoUser({
                    uid: userRef.user.uid,
                    name: data.name,
                    email: data.email,
                });

                toast.success("Usuário cadastrado com sucesso!")
                navigate("/dashboard", {replace: true});
            }
        }catch(err: unknown){
            const errorString:string = String(err)
            
            console.error(err);

            if(errorString.includes("already-in-use")){
                toast.warning("Este e-mail já está em uso.");
                return;
            }

            toast.error("Houve um erro ao tentar criar o usuário!")
            reset();

        }
    }



    return (
        <Container>
            <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
                <Link to="/" className="mb-6 flex justify-center max-w-sm w-full"><Logo /></Link>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 bg-white max-w-xl w-full rounded-lg">

                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-lg" htmlFor="email">Nome completo</label>
                        <Input 
                            aria-label="Campo de nome completo"
                            autoFocus
                            id="name"
                            register={register('name')}
                            type="text"
                            placeholder="Digite seu nome completo"
                            error={errors.name?.message}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-lg" htmlFor="email">Email</label>
                        <Input 
                            aria-label="Campo de e-mail"
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
                    <Button text="Cadastrar" />
                </form>

                <p>
                    Já possui uma conta? <Link aria-label="Faça login aqui" className="text-blue-400" to="/login">Faça login aqui!</Link>
                </p>

            </div>
        </Container>
    )
}

export default Register;