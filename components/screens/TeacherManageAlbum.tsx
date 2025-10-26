
import React, { useState, useRef, useEffect } from 'react';
import { AlbumPhoto } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';

interface TeacherManageAlbumProps {
    photos: AlbumPhoto[];
    onSave: (caption: string, image: string) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    onLogout: () => void;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const TeacherManageAlbum: React.FC<TeacherManageAlbumProps> = ({ photos, onSave, onDelete, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const resetForm = () => {
        setCaption('');
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setImage(base64);
        }
    };
    
    useEffect(() => {
        if (isCameraOpen && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                }).catch(err => {
                    console.error("Camera error:", err);
                    setIsCameraOpen(false);
                });
        }
         return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCameraOpen]);

    const handleCapture = () => {
        const video = videoRef.current;
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
            setImage(canvas.toDataURL('image/jpeg'));
            setIsCameraOpen(false);
        }
    };
    
    const handleSave = () => {
        if(caption.trim() && image){
            onSave(caption, image);
            resetForm();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    const handleDeleteClick = (id: number) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الصورة؟')) {
            onDelete(id);
        }
    };

    if (isCameraOpen) {
        return (
            <div className="bg-black fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-w-lg rounded-lg"></video>
                <div className="mt-4 flex gap-4">
                    <button onClick={handleCapture} className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg">{t('capture')}</button>
                    <button onClick={() => setIsCameraOpen(false)} className="bg-gray-300 text-black font-bold py-3 px-6 rounded-full shadow-lg">{t('cancel')}</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10"><LanguageSwitcher /></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('classAlbum')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 text-center">{t('addPhoto')}</h2>
                 <input type="text" placeholder={t('photoCaption')} value={caption} onChange={e => setCaption(e.target.value)} className="w-full p-3 border-2 rounded-lg" />
                
                {image && <div className="p-2 border-2 border-dashed rounded-lg"><img src={image} alt="Preview" className="max-h-48 mx-auto rounded"/></div>}
                
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div className="flex gap-2">
                     <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300">📎 {t('uploadPhoto')}</button>
                    <button onClick={() => setIsCameraOpen(true)} className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300">📸 {t('takePhoto')}</button>
                </div>
                <button onClick={handleSave} disabled={!caption || !image} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-gray-400">{t('sendForReview')}</button>
                {saveSuccess && <p className="text-green-600 text-center font-semibold animate-pulse">{t('photoSentForReview')}</p>}
            </div>
            
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center border-t pt-4">{t('classAlbum')}</h2>
                <div className="max-h-60 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-2 p-2">
                    {photos.length > 0 ? (
                        [...photos].sort((a,b) => b.id - a.id).map(photo => (
                            <div key={photo.id} className="relative group">
                                <img src={photo.image} alt={photo.caption} className={`w-full h-24 object-cover rounded-lg shadow-sm ${photo.status === 'pending' ? 'opacity-50' : ''}`} />
                                <div className="absolute top-1 left-1">
                                    <span className={`text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ${photo.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                        {t(photo.status === 'approved' ? 'approved' : 'pendingReview')}
                                    </span>
                                </div>
                                <button onClick={() => handleDeleteClick(photo.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">X</button>
                            </div>
                        ))
                    ) : <p className="col-span-full text-center text-gray-500 py-4">{t('noPhotos')}</p>}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherManageAlbum;