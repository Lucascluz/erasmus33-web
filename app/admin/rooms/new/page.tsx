"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import { Textarea } from "@/components/ui/textarea";
import { Trash, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface House {
    id: string;
    number: string;
    street: string;
}

export default function NewRoomPage() {
    const [formData, setFormData] = useState({
        number: "",
        price: "",
        description: "",
        type: "",
        spots: "",
        is_available: true,
        house_id: "",
    });

    const [houses, setHouses] = useState<House[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        async function fetchHouses() {
            const supabase = createClient();
            const { data: housesData, error } = await supabase
                .from("houses")
                .select("id, number, street")
                .order("number");

            if (error) {
                console.error("Error fetching houses:", error);
                setError("Failed to load houses.");
                return;
            }

            setHouses(housesData || []);
        }

        fetchHouses();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        } else {
            setError("No files selected.");
        }
    };

    const validateInputs = () => {
        if (!formData.number.trim()) {
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
        if (!formData.spots || isNaN(Number(formData.spots)) || Number(formData.spots) <= 0) {
            return "Number of spots must be a valid positive number.";
        }
        if (!formData.house_id) {
            return "Please select a house.";
        }
        if (newImages.length === 0) {
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

            // Generate a UUID for the room
            const roomId = uuidv4();

            // Get house number for the selected house
            const selectedHouse = houses.find(h => h.id === formData.house_id);
            if (!selectedHouse) {
                throw new Error("Selected house not found.");
            }

            // Upload images to storage bucket
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

            // Insert room data into the database
            const { error: insertError } = await supabase.from("rooms").insert({
                id: roomId,
                number: Number(formData.number),
                price: Number(formData.price),
                description: formData.description.trim(),
                type: formData.type.trim(),
                spots: Number(formData.spots),
                is_available: formData.is_available,
                house_id: formData.house_id,
                house_number: Number(selectedHouse.number),
                images: uploadedImageUrls,
            });

            if (insertError) {
                throw new Error(insertError.message);
            }

            router.push("/admin/rooms");
        } catch (err: unknown) {
            setError((err as Error).message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-8 md:px-12 lg:px-20 xl:px-32">
            <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin/rooms">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Rooms
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Create New Room</h1>
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
                                <Label htmlFor="spots">Number of spots</Label>
                                <Input
                                    id="spots"
                                    name="spots"
                                    type="number"
                                    min="1"
                                    value={formData.spots}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Number of spots"
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
                            <Label htmlFor="images">Room Images</Label>
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

                        <div>
                            <div className="flex flex-wrap gap-4">
                                {newImages.map((image) => (
                                    <div key={image.name} className="relative">
                                        <Image
                                            src={URL.createObjectURL(image)}
                                            width={128}
                                            height={128}
                                            alt="New Room Image"
                                            className="w-32 h-32 object-cover rounded-md shadow-md"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-1 right-1"
                                            onClick={() => setNewImages((prev) => prev.filter((img) => img !== image))}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Creating..." : "Create Room"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
