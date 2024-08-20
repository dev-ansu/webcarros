import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { Link } from "react-router-dom";


export interface CarsProps{
    id: string;
    name: string;
    year: string;
    uid: string;
    price: string | number;
    city: string;
    km: string;
    images: CarImageProps[];
}

export interface CarImageProps{
    uid: string;
    name:string;    
    url: string;
}

const Home = ()=>{
    const [cars, setCars] = useState<CarsProps[]>();
    const [loadImages, setLoadImages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    useEffect(()=>{
        loadCars();
    },[])

    const loadCars = async()=>{
        const carsRef = collection(db, 'cars');
        const queryRef = query(carsRef, orderBy('createdAt', 'desc'));
        try{
            const snapshot = await getDocs(queryRef);
            const listCars = [] as CarsProps[];
            snapshot.forEach( doc => {
                listCars.push({
                    id: doc.id,
                    name: doc.data().name,
                    year: doc.data().year,
                    km: doc.data().km,
                    city: doc.data().city,
                    images: doc.data().images,
                    price: doc.data().price,
                    uid: doc.data().uid,
                });
            })
            setCars(listCars);
        }catch(err){
            console.log(err);
        }
    }

    const handleImageLoad = (id: string)=>{
        setLoadImages((prev) => [...prev, id]);
    }

    const handleSearchCar = async()=>{
        if(input.trim() === ''){
            loadCars();
            return;
        }
        setCars([]);
        setLoadImages([]);
        const q = query(collection(db, 'cars'), 
            where('name', ">=", input.toUpperCase()),
            where('name', "<=", input.toUpperCase() + "\uf8ff")
        )
        const querySnapshot = await getDocs(q);
        const listCars = [] as CarsProps[];
        querySnapshot.forEach(doc => {
            listCars.push({
                id: doc.id,
                name: doc.data().name,
                year: doc.data().year,
                km: doc.data().km,
                city: doc.data().city,
                images: doc.data().images,
                price: doc.data().price,
                uid: doc.data().uid,
            });
        });
        setCars(listCars);
        return;
    }

    

    return (
        <>
        <section className="bg-white rounded-lg p-4 w-full max-w-3xl mx-auto flex items-center justify-center gap-2">
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full border-2 rounded-lg h-9 px-3 outline-none "
                placeholder="Digite o nome do carro"
                />
            <button onClick={handleSearchCar} className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg">Buscar</button>
        </section>
        <h1 className="font-bold text-center mt-6 text-2xl mb-4">Carros novos e usados em todo Brasil!</h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars?.map(car => (
                <Link key={car.id} to={`/car/${car.id}`}>
                    <section className="w-full bg-white rounded-lg">
                        <div style={{display: loadImages.includes(car.id) ? "none":"block"}} className="w-full h-72 rounded-lg mb-2 max-h-72 bg-slate-200"></div>
                        <img
                            style={{display: loadImages.includes(car.id) ? "block":"none"}}
                            className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                            src={car.images[0].url}
                            alt={car.name}
                            onLoad={()=> handleImageLoad(car.id)}
                            />
                        
                        <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>
                        <div className="flex flex-col px-2">
                            <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km}km</span>
                            <strong className="text-black font-medium text-xl">{Number(car.price).toLocaleString('pt-br', {style:"currency", currency:"BRL"})}</strong>
                        </div>
                        <div className="w-full h-px bg-slate-200 my-2"></div>

                        <div className="px-2 pb-2">
                            <span className="text-zinc-700">{car.city}</span>
                        </div>
                    </section>
                </Link>
            ))}
        </main>
        
        </>
    )
}

export default Home;