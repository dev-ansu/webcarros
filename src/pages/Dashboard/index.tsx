import { FiTrash2 } from "react-icons/fi";
import PainelHeader from "../../components/painelHeader";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import { CarsProps } from "../Home";
import { useAuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";

const Dashboard = ()=>{
    const [cars, setCars] = useState<CarsProps[]>([]);
    const {user} = useAuthContext();
    const [loadImages, setLoadImages] = useState<string[]>([]);
    
    useEffect(()=>{
        const loadCars = async()=>{
            if(user?.uid){
                const carsRef = collection(db, 'cars');
                const queryRef = query(carsRef, where('uid','==', user.uid));
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
        }
        loadCars();
    })

    const handleDeleteCar = async (car: CarsProps)=>{
        const docRef = doc(db, 'cars',car.id);
        try{
            await deleteDoc(docRef);
            car.images.map(async image => {
                const imagePath = `images/${image.uid}/${image.name}`
                const imageRef = ref(storage, imagePath);
                try{
                    await deleteObject(imageRef);
                    cars.filter(car => car.id != car.id);
                }catch(err){
                    console.log(err)
                }
            })
            toast.success("Registro excluído com sucesso.");
        }catch(err){
            console.log(err);
        }
    }
    
    const handleImageLoad = (id: string)=>{
        setLoadImages((prev) => [...prev, id]);
    }
    return (
        <>
            <PainelHeader />
            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                {cars.map(car => (

                    <section className="w-full bg-white rounded-lg relative" >
                    <button onClick={()=> handleDeleteCar(car)} className="absolute bg-white rounded-full w-14 h-14 flex items-center justify-center right-2 top-2 drop-shadow">
                        <FiTrash2 size={26} color="#000"  />
                    </button>
                    <div style={{display: loadImages.includes(car.id) ? "none":"block"}} className="w-full h-72 rounded-lg mb-2 max-h-72 bg-slate-200"></div>

                    <img 
                        style={{display: loadImages.includes(car.id) ? "block":"none"}}
                        onLoad={()=> handleImageLoad(car.id)}
                        className="w-full rounded-lg mb-2 max-h-72"
                        src={car.images[0].url}
                        alt={car.name}
                    />
                    <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>
                    <div className="flex flex-col px-2">
                        <span className="text-zinc-700">Ano {car.year} | {car.km}</span>
                        <strong className="text-black font-bold mt-4"> {car.price.toLocaleString('pt-br', {style:"currency", currency:"BRL"})}</strong>
                    </div>
                    <div className="w-full h-px bg-slate-200 my-2"></div>
                    <div className="px-2 pb-2">
                        <span className="text-black">{car.city}</span>
                    </div>
                    </section>
                ))}

            </main>
        </>
    )
}

export default Dashboard;
