"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { v4 as uuidv4 } from "uuid";
import ImageList from "@/components/image-list";

export default function EditHousePage() {
    const [formData, setFormData] = useState({
        number: "",
        street: "",
        postal_code: "",
        description: "",
        images: [] as string[],
    });

    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const params = useParams();
    const houseId = params.id as string;

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        async function fetchHouseData() {
            if (!houseId) {
                setError("House ID is missing.");
                return;
            }

            try {
                const supabase = createClient();
                const { data, error } = await supabase.from("houses").select("*").eq("id", houseId).single();

                if (error) {
                    throw new Error("Failed to fetch house data.");
                }

                setFormData({
                    number: data.number || "",
                    street: data.street || "",
                    postal_code: data.postal_code || "",
                    description: data.description || "",
                    images: data.images || [],
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            }
        }

        fetchHouseData();
    }, [houseId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setNewImages((prev) => [...prev, ...files]);

            // Clear the file input after selection
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } else {
            setError("No files selected.");
        }
    };

    const handleImageRemove = (imageUrl: string) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img !== imageUrl),
        }));
        setDeletedImages((prev) => [...prev, imageUrl]);
    };

    const validateInputs = () => {
        if (!formData.number) {
            return "House number must be a valid number.";
        }
        if (!formData.street.trim()) {
            return "Street name is required.";
        }
        if (!formData.postal_code.trim()) {
            return "Postal code is required.";
        }
        return "";
    };

    // Fix the issue where new images replace existing images
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

            // Upload the new images to storage bucket
            const uploadedImageUrls: string[] = [];
            for (const image of newImages) {
                // Generate UUID for each image
                const imageId = uuidv4();

                const { data, error: uploadError } = await supabase.storage
                    .from("house_images")
                    .upload(`${houseId}/${imageId}`, image);

                if (uploadError) {
                    throw new Error(uploadError.message);
                }

                const publicUrl = supabase.storage.from("house_images").getPublicUrl(data?.path || "").data?.publicUrl;
                if (publicUrl) {
                    uploadedImageUrls.push(publicUrl);
                }
            }

            // Delete the old images that are marked for deletion
            for (const imageUrl of deletedImages) {

                // Extract the image ID from the URL
                const imageId = imageUrl.split("/").pop();
                if (imageId) {
                    const { error: deleteImageError } = await supabase.storage.from("house_images").remove([`${houseId}/${imageId}`]);

                    if (deleteImageError) {
                        console.error("Failed to delete image:", deleteImageError.message);
                    }
                }
            }

            // Combine existing images with newly uploaded images
            const existingImages = formData.images.filter((img) => !deletedImages.includes(img));
            const allImages = [...existingImages, ...uploadedImageUrls];

            // Update the house data in the database
            const { error: updateError } = await supabase.from("houses").update({
                images: allImages,
                number: formData.number,
                street: formData.street.trim(),
                postal_code: formData.postal_code.trim(),
                description: formData.description.trim(),
            }).eq("id", houseId);

            if (updateError) {
                throw new Error(updateError.message);
            }

            // Redirect to the houses list page
            router.push("/admin/houses");
        } catch (err: unknown) {
            setError((err as Error).message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHouse = async () => {
        // Delete the house and its images
        try {
            const supabase = createClient();
            const { error } = await supabase.from("houses").delete().eq("id", houseId);

            if (error) {
                throw new Error(error.message);
            }

            formData.images.forEach(async (imageUrl) => {

                // Extract the image ID from the URL
                const imageId = imageUrl.split("/").pop();
                if (imageId) {
                    const { error: deleteImageError } = await supabase.storage.from("house_images").remove([`${houseId}/${imageId}`]);

                    if (deleteImageError) {
                        console.error("Failed to delete image:", deleteImageError.message);
                    }
                }
            });

            router.push("/admin/houses");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    // Adjust the layout to occupy more width and make it responsive
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Edit House</h1>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="number">House Number</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    type="text"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Enter house number"
                                />
                            </div>
                            <div>
                                <Label htmlFor="street">Street</Label>
                                <Input
                                    id="street"
                                    name="street"
                                    type="text"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Enter street name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="postal_code">Postal Code</Label>
                                <Input
                                    id="postal_code"
                                    name="postal_code"
                                    type="text"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Enter postal code"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Enter house description"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="images">Upload Images</Label>
                            <Input
                                id="images"
                                name="images"
                                type="file"
                                multiple
                                ref={fileInputRef}
                                onChange={handleImageAdd}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <ImageList
                                formDataImages={formData.images}
                                newImages={newImages}
                                onDeleteFormDataImage={handleImageRemove}
                                onDeleteNewImage={(image) => setNewImages((prev) => prev.filter((img) => img !== image))}
                            />
                        </div>

                        <div className="flex space-x-4 mt-4">
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={loading} className="w-32">
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete this house and remove its data from the servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" disabled={loading} className="w-32">
                                                    I&apos;m Aware
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirm Deletition</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDeleteHouse} className="bg-red-600 text-white hover:bg-red-700">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}