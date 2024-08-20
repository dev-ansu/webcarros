import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    register?: UseFormRegisterReturn;
    error?: string;
}

const Input = ({register, error, className, ...props}: InputProps)=>{
    const classes = `w-full border-2 rounded-md h-11 px-2 ${error ? "border-l-2 border-red-700 bg-red-300 placeholder:text-black":""}`;
    const combinedClasses = className ? `${className} ${classes}`:classes;

    return (
        <div>
            <input
                className={combinedClasses}
                {...register}
                {...props}
            />
            {error &&
                <span aria-label={error} className="text-red-600 font-medium text-xs">{error}</span>
            }
        </div>
    )

}


export default Input;