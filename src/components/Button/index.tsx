import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    text: string;
}

const Button = ({text, className, ...props}: ButtonProps)=>{
    const classes = `px-4 py-2 bg-red-500 text-white rounded-lg justify-center self-start font-medium`;
    const combinedClasses = className ? `${className} ${classes}`:classes;

    return(
        <button  type="submit" className={combinedClasses}>
            {text}
        </button>
    )
}

export default Button;