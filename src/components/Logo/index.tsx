
const Logo = ()=>{
    return (
        <div aria-label="Esta é a logo da WebCarros. Um retângulo vermelho inclinado para a direita." 
        className={`w-auto max-w-max h-auto bg-red-600 transform -skew-x-12 text-white p-2`}>
            <h1 className="text-3xl font-bold">
                <span className="text-black">Web</span>
                <span className="text-white">Carros</span>
            </h1>
        </div>
    )
}

export default Logo;