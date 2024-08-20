import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { CarsProps } from "../Home";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import {Swiper, SwiperSlide} from "swiper/react";
import { toast } from "react-toastify";


interface CarProps extends CarsProps{
    model: string;
    description: string;
    createdAt: string;
    price: string | number;
    owner: string;
    uid: string;
    whatsapp: string;
}

const CarDetail = ()=>{
    const [car, setCar] = useState<CarProps>();
    const { id } = useParams();
    const [ slidesPerView, setSlidesPerView ] = useState<number>(2);

    const navigate = useNavigate();

    useEffect(()=>{
        const loadCar = async()=>{
            if(!id){
                return;
            }
            const docRef = doc(db, 'cars', id);
            try{
                const snapshot = await getDoc(docRef);
                
                if(snapshot.data() === undefined || !snapshot){
                    toast.error("Carro não encontrado");
                    return navigate("/");
                }

                setCar({
                    id: docRef.id,
                    name: snapshot.data()?.name,
                    year: snapshot.data()?.year,
                    description: snapshot.data()?.description,
                    city: snapshot.data()?.city,
                    createdAt: snapshot.data()?.createdAt,
                    images: snapshot.data()?.images,
                    km: snapshot.data()?.km,
                    model: snapshot.data()?.model,
                    owner: snapshot.data()?.owner,
                    price: snapshot.data()?.price,
                    uid: snapshot.data()?.uid,
                    whatsapp: snapshot.data()?.whatsapp
                });

            }catch(err){
                console.log(err)
            }
        }
        loadCar();
    }, [])    
    
    useEffect(()=>{
        const handleResize = ()=>{
            if(window.innerWidth < 720){
                setSlidesPerView(1);
            }else{
                setSlidesPerView(2);
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[]);
    return (
        <>
            <Swiper slidesPerView={slidesPerView}
                pagination={{clickable: true}}
                navigation
            >
                {car?.images.map(image => (
                    <SwiperSlide key={image.name}>
                        <img 
                            alt={image.name}
                            src={image.url}
                            className="w-full h-96 object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {car && 
                (
                    <main className="w-ful bg-white rounded-lg p-6 my-4">
                        <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
                            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
                            <h1 className="font-bold text-3xl text-black">{Number(car?.price).toLocaleString('pt-br', {currency:"BRL", style:"currency"})}</h1>
                        </div>
                        <p>{car?.model}</p>
                        <div className="flex w-full gap-6 my-4">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <p>Cidade</p>
                                    <strong>{car?.city}</strong>
                                </div>

                                <div>
                                    <p>Ano</p>
                                    <strong>{car?.year}</strong>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <p>km</p>
                                    <strong>{car?.km}</strong>
                                </div>
                            </div>
                        </div>
                        <strong>Descrição</strong>
                        <p className="mb-4">{car?.description}</p>
                        <strong>Telefone/WhatsApp</strong>
                        <p>{car?.whatsapp}</p>

                        <a 
                        href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, vi esse ${car?.name} e fiquei interessado.`}
                        target="_blank"
                        className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium hover:bg-green-600 cursor-pointer">
                            Conversar com vendedor <FaWhatsapp size={26} color="#fff" />
                        </a>
                    </main>
                )
            }
        </>
    )
}

export default CarDetail;