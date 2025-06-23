import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";

interface AdminImageManagerProps {
    // Current images from database
    currentImages: string[];
    // New images selected by user
    newImages: File[];
    // Callbacks
    onImageAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteCurrentImage: (imageUrl: string) => void;
    onDeleteNewImage: (index: number) => void;
    // Configuration
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    entityType?: "house" | "room"; // For alt text
}

export function AdminImageManager({
    currentImages,
    newImages,
    onImageAdd,
    onDeleteCurrentImage,
    onDeleteNewImage,
    disabled = false,
    label = "Images",
    placeholder = "Add New Images",
    entityType = "house"
}: AdminImageManagerProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        onImageAdd(e);
        // Clear the file input after selection
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-4">
            {/* File Input */}
            <div>
                <Label htmlFor="images">{placeholder}</Label>
                <Input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageAdd}
                    disabled={disabled}
                />
            </div>

            {/* Images Display */}
            {(currentImages.length > 0 || newImages.length > 0) && (
                <div>
                    <Label>{label}</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {/* Current Images */}
                        {currentImages.map((imageUrl, index) => (
                            <div key={`current-${index}`} className="relative">
                                <Image
                                    src={imageUrl}
                                    alt={`Current ${entityType} Image ${index + 1}`}
                                    width={128}
                                    height={128}
                                    className="w-32 h-32 object-cover rounded-md shadow-md"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-1 right-1"
                                    onClick={() => onDeleteCurrentImage(imageUrl)}
                                    disabled={disabled}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                                <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                    Current
                                </div>
                            </div>
                        ))}

                        {/* New Images */}
                        {newImages.map((image, index) => (
                            <div key={`new-${index}`} className="relative">
                                <Image
                                    src={URL.createObjectURL(image)}
                                    alt={`New ${entityType} Image ${index + 1}`}
                                    width={128}
                                    height={128}
                                    className="w-32 h-32 object-cover rounded-md shadow-md"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-1 right-1"
                                    onClick={() => onDeleteNewImage(index)}
                                    disabled={disabled}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                                <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                    New
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
