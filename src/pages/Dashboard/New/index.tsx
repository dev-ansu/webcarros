import { FiTrash, FiUpload } from "react-icons/fi";
import PainelHeader from "../../../components/painelHeader";
import {useForm} from "react-hook-form"
import Input from "../../../components/Input/indext";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewCarData, newCarSchemaValidation } from "../../../schemas/newCarSchemaValidation";
import Button from "../../../components/Button";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { db, storage } from "../../../services/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { getISODateTime } from "../../../helpers/helpers";

interface ImageItemProps{
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}
const New = ()=>{
    const [carImages, setCarImages] = useState<ImageItemProps[]>([]);
    const {user} = useAuthContext();
    // const [] = useState();
    const {register, formState: { errors }, reset, handleSubmit} = useForm<NewCarData>({
        mode:"onChange",
        resolver: zodResolver(newCarSchemaValidation),
    });


    const onSubmit = async(data:NewCarData)=>{
        if(carImages.length <= 0){
            toast.error("É obrigatório enviar pelo menos uma imagem do carro.")
            return;
        }

        const carListImages = carImages.map( car => {
            return {
                uid: car.uid,
                name: car.name, 
                url: car.url
            }
        })

        try{
            data.name = data.name.toUpperCase();
            const docRef = await addDoc(collection(db, 'cars'), {
                uid: user?.uid,
                owner: user?.name,
                ...data,
                createdAt: getISODateTime('pt-br', true),
                images: carListImages,
            });
            if(docRef.id){
                toast.success("Registro salvo com sucesso.");
                setCarImages([]);
                reset();
                return;
            }else{
                toast.error("Registro não foi salvo.");
                return;
            }
        }catch(err){
            toast.error("Hove um erro ao tentar salvar os dados.");
            console.log(err);
        }
    }

    const handleFile = async (e: ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files[0]){
            const acceptedFiles = ['image/jpeg', 'image/png','image/jpg'];
            const image = e.target.files[0];
            if(acceptedFiles.includes(image.type)){
                // enviar para o banco de dados
                await handleUpload(image)
            }else{
                const message = "As imagens devem ser do tipo: " + String(acceptedFiles.join(", ")).replace(/image\//g, "");
                toast.warning(message);
                return;
            }
        }        
    }

    const handleUpload = async(image: File)=>{
        if(!user?.uid){
            return;
        }
        const current_uid = user.uid;
        const uid_image = uuidV4();
        const uploadRef = ref(storage, `images/${current_uid}/${uid_image}`);
        const snapshot = await uploadBytes(uploadRef, image); 
        const downloadUrl = await getDownloadURL(snapshot.ref)
        const imageItem: ImageItemProps = {
            uid: current_uid,
            name: uid_image,
            previewUrl: URL.createObjectURL(image),
            url: downloadUrl,
        };
        setCarImages((images) => [...images, imageItem]);
    }
    const handleDeleteImage = async(image: ImageItemProps)=>{
        const imagePath = `images/${image.uid}/${image.name}`;
        const imageRef = ref(storage, imagePath);
        try{
            await deleteObject(imageRef);
            setCarImages(carImages.filter(car => car.url != image.url))
        }catch(err){
            toast.error("Houve um erro ao tentar apagar a imagem.")
        }
    }
    return (
        <>
            <PainelHeader />
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className="cursor-pointer ">
                        <input onChange={handleFile} type="file" accept="image/*" className="opacity-0 cursor-pointer" />
                    </div>
                </button>
                {carImages.map(image => (
                    <div key={image.name} className="w-full h-32 flex items-center justify-center relative">
                        <button className="absolute" onClick={() => handleDeleteImage(image)}>
                            <FiTrash size={28} color="#fff" />
                        </button>
                        <img 
                            src={image.previewUrl}
                            className="rounded-lg w-full h-32 object-cover" 
                            alt="Foto do carro" 
                        />
                    </div>
                ))}
            </div>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label htmlFor="name" className="mb-2 font-medium">Nome do carro</label>
                        <Input error={errors.name?.message} placeholder="Ex.: onix 1.0" register={register('name')} type='text' id="name" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="model" className="mb-2 font-medium">Modelo do carro</label>
                        <Input error={errors.model?.message} placeholder="Ex.: 1.0 flex manual" register={register('model')} type='text' id="model" />
                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <label htmlFor="year" className="mb-2 font-medium">Ano</label>
                            <Input error={errors.year?.message} placeholder="Ex.: 2016/2017" register={register('year')} type='text' id="year" />
                        </div>
                        <div className="w-full">
                            <label htmlFor="km" className="mb-2 font-medium">km(quilômetros) rodados</label>
                            <Input error={errors.km?.message} placeholder="Ex.: 23.900" register={register('km')} type='text' id="km" />
                        </div>
                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <label htmlFor="whatsapp" className="mb-2 font-medium">WhatsApp/telefone</label>
                            <Input error={errors.whatsapp?.message} placeholder="Ex.: 11999999999" register={register('whatsapp')} type='text' id="whatsapp" />
                        </div>
                        <div className="w-full">
                            <label htmlFor="city" className="mb-2 font-medium">Cidade</label>
                            <Input error={errors.city?.message} placeholder="Ex.: Fortaleza, CE" register={register('city')} type='text' id="city" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="mb-2 font-medium">Preço do carro</label>
                        <Input error={errors.price?.message} placeholder="Ex.: 69.000" register={register('price')} type='text' id="price" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="mb-2 font-medium">Descrição</label>
                        <textarea placeholder="Digite a descrição completa sobre o carro" className="border-2 w-full rounded-md h-24 px-2" {...register("description")} id="description"></textarea>
                        {errors.description && <span className="text-red-600 font-medium text-xs">{errors.description.message}</span>}
                    </div>
                    <Button text="Cadastrar" />
                </form>
            </div>
        </>
    )
}

export default New;