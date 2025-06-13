"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import { Trash, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface House {
    id: string;
    number: string;
    street: string;
}

export default function EditRoomPage() {
    const [formData, setFormData] = useState({
        number: 0,
        price: 0,
        description: "",
        type: "",
        beds: 0,
        renters: [] as string[],
        is_available: true,
        house_id: "",
        house_number: "",
        images: [] as string[],
    });

    const [houses, setHouses] = useState<House[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingRoom, setLoadingRoom] = useState(true);
    const [error, setError] = useState("");

    const router = useRouter();
    const params = useParams();
    const roomId = params.id as string;

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (!roomId) {
                setError("Room ID is missing.");
                setLoadingRoom(false);
                return;
            }

            try {
                const supabase = createClient();

                // Fetch room data
                const { data: roomData, error: roomError } = await supabase
                    .from("rooms")
                    .select("*")
                    .eq("id", roomId)
                    .single();

                if (roomError) {
                    throw new Error("Failed to fetch room data.");
                }

                setFormData({
                    number: roomData.number || "",
                    price: roomData.price?.toString() || "",
                    description: roomData.description || "",
                    type: roomData.type || "",
                    beds: roomData.beds?.toString() || "",
                    renters: roomData.renters?.toString() || "",
                    is_available: roomData.is_available || false,
                    house_id: roomData.house_id || "",
                    house_number: roomData.house_number?.toString() || "",
                    images: roomData.images || [],
                });

                // Fetch houses
                const { data: housesData, error: housesError } = await supabase
                    .from("houses")
                    .select("id, number, street")
                    .order("number");

                if (housesError) {
                    console.error("Error fetching houses:", housesError);
                    setError("Failed to load houses.");
                    return;
                }

                setHouses(housesData || []);

            } catch (err: unknown) {
                setError((err as Error).message || "Failed to load room data.");
            } finally {
                setLoadingRoom(false);
            }
        }

        fetchData();
    }, [roomId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "house_id") {
            // Find the selected house and set both house_id and house_number
            const selectedHouse = houses.find(h => h.id === value);
            setFormData((prev) => ({
                ...prev,
                house_id: value,
                house_number: selectedHouse ? selectedHouse.number : ""
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            setNewImages((prev) => [
                ...prev,
                ...files.filter((file) => file.type.startsWith("image/")),
            ]);

            // Clear the file input after selection
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDeleteExistingImage = (imageUrl: string) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img !== imageUrl),
        }));
        setDeletedImages((prev) => [...prev, imageUrl]);
    };

    const validateInputs = () => {
        if (!formData.number) {
            return "Room number is required.";
        }
        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            return "Price must be a valid positive number.";
        }
        if (!formData.description.trim()) {
            return "Description is required.";
        }
        if (!formData.type.trim()) {
            return "Room type is required.";
        }
        if (!formData.beds || isNaN(Number(formData.beds)) || Number(formData.beds) <= 0) {
            return "Number of beds must be a valid positive number.";
        }
        if (!formData.renters || isNaN(Number(formData.renters)) || Number(formData.renters) <= 0) {
            return "Number of renters must be a valid positive number.";
        }
        if (!formData.house_id) {
            return "Please select a house.";
        }
        if (formData.images.length === 0 && newImages.length === 0) {
            return "At least one image is required.";
        }
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const supabase = createClient();

            // Upload new images to storage bucket
            const uploadedImageUrls: string[] = [];
            for (const image of newImages) {
                // Generate UUID for each image
                const imageId = uuidv4();

                const { data, error: uploadError } = await supabase.storage
                    .from("room_images")
                    .upload(`${roomId}/${imageId}`, image);

                if (uploadError) {
                    throw new Error(uploadError.message);
                }

                const publicUrl = supabase.storage.from("room_images").getPublicUrl(data?.path || "").data?.publicUrl;
                if (publicUrl) {
                    uploadedImageUrls.push(publicUrl);
                }
            }

            // Delete removed images from storage
            for (const imageUrl of deletedImages) {
                try {
                    // Extract the path from the URL to delete from storage
                    const urlParts = imageUrl.split('/');
                    const pathIndex = urlParts.findIndex(part => part === 'room_images');
                    if (pathIndex !== -1 && pathIndex < urlParts.length - 1) {
                        const imagePath = urlParts.slice(pathIndex + 1).join('/');
                        await supabase.storage.from("room_images").remove([imagePath]);
                    }
                } catch (deleteError) {
                    console.warn("Failed to delete image from storage:", deleteError);
                }
            }

            // Combine existing images with new uploaded images
            const allImages = [...formData.images, ...uploadedImageUrls];

            // Update room data in the database
            const { error: updateError } = await supabase
                .from("rooms")
                .update({
                    number: formData.number,
                    price: Number(formData.price),
                    description: formData.description.trim(),
                    type: formData.type.trim(),
                    beds: Number(formData.beds),
                    renters: formData.renters,
                    is_available: formData.is_available,
                    house_id: formData.house_id,
                    house_number: formData.house_number,
                    images: allImages,
                })
                .eq("id", roomId);

            if (updateError) {
                throw new Error(updateError.message);
            }

            router.push("/admin/rooms");
        } catch (err: unknown) {
            setError((err as Error).message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingRoom) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="w-full max-w-4xl">
                    <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-10 bg-gray-300 rounded"></div>
                                <div className="h-10 bg-gray-300 rounded"></div>
                            </div>
                            <div className="h-20 bg-gray-300 rounded"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin/rooms">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Rooms
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Edit Room</h1>
                    </div>

                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="number">Room Number</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    type="text"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Enter room number"
                                />
                            </div>

                            <div>
                                <Label htmlFor="house_id">House</Label>
                                <select
                                    id="house_id"
                                    name="house_id"
                                    value={formData.house_id}
                                    onChange={handleSelectChange}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                                >
                                    <option value="">Select a house</option>
                                    {houses.map((house) => (
                                        <option key={house.id} value={house.id}>
                                            House {house.number} - {house.street}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="price">Price (€/month)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Enter monthly price"
                                />
                            </div>

                            <div>
                                <Label htmlFor="type">Room Type</Label>
                                <Input
                                    id="type"
                                    name="type"
                                    type="text"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="e.g., Single, Double, Suite"
                                />
                            </div>

                            <div>
                                <Label htmlFor="beds">Number of Beds</Label>
                                <Input
                                    id="beds"
                                    name="beds"
                                    type="number"
                                    min="1"
                                    value={formData.beds}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Number of beds"
                                />
                            </div>

                            <div>
                                <Label htmlFor="renters">Max Renters</Label>
                                <Input
                                    id="renters"
                                    name="renters"
                                    type="number"
                                    min="1"
                                    value={formData.renters}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Maximum number of renters"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleTextareaChange}
                                disabled={loading}
                                placeholder="Enter room description"
                                rows={4}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                id="is_available"
                                name="is_available"
                                type="checkbox"
                                checked={formData.is_available}
                                onChange={handleInputChange}
                                disabled={loading}
                                className="rounded border-input"
                            />
                            <Label htmlFor="is_available">Room is available for rent</Label>
                        </div>

                        <div>
                            <Label htmlFor="images">Add New Images</Label>
                            <input
                                id="images"
                                name="images"
                                type="file"
                                multiple
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageAdd}
                                disabled={loading}
                                className="block w-full text-sm text-muted-foreground border border-input rounded-md cursor-pointer focus:outline-none"
                            />
                        </div>

                        {/* All Images Display - Current and New */}
                        {(formData.images.length > 0 || newImages.length > 0) && (
                            <div>
                                <Label>Room Images</Label>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    {/* Current Images */}
                                    {formData.images.map((imageUrl, index) => (
                                        <div key={`current-${index}`} className="relative">
                                            <img
                                                src={imageUrl}
                                                alt={`Current Room Image ${index + 1}`}
                                                className="w-32 h-32 object-cover rounded-md shadow-md"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-1 right-1"
                                                onClick={() => handleDeleteExistingImage(imageUrl)}
                                                disabled={loading}
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
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`New Room Image ${index + 1}`}
                                                className="w-32 h-32 object-cover rounded-md shadow-md"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-1 right-1"
                                                onClick={() => setNewImages((prev) => prev.filter((_, i) => i !== index))}
                                                disabled={loading}
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

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Updating..." : "Update Room"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
