import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ImageListProps {
    formDataImages: string[];
    newImages: File[];
    onDeleteFormDataImage: (imageUrl: string) => void;
    onDeleteNewImage: (image: File) => void;
}

export default function ImageList({
    formDataImages,
    newImages,
    onDeleteFormDataImage,
    onDeleteNewImage,
}: ImageListProps) {
    return (
        <div className="flex flex-wrap gap-4">
            {formDataImages.map((imageUrl) => (
                <div key={imageUrl} className="relative">
                    <img
                        src={imageUrl}
                        alt="House Image"
                        className="w-32 h-32 object-cover rounded-md shadow-md"
                    />
                    <Button
                        variant="destructive"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
                        onClick={() => onDeleteFormDataImage(imageUrl)}
                    >
                        <Trash className="w-6 h-6" />
                    </Button>
                </div>
            ))}
            {newImages.map((image) => (
                <div key={image.name} className="relative">
                    <img
                        src={URL.createObjectURL(image)}
                        alt="New House Image"
                        className="w-32 h-32 object-cover rounded-md shadow-md"
                    />
                    <Button
                        variant="destructive"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
                        onClick={() => onDeleteNewImage(image)}
                    >
                        <Trash className="w-6 h-6" />
                    </Button>
                </div>
            ))}
        </div>
    );
}
