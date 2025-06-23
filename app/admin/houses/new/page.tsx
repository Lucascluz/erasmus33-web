"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidv4 } from "uuid";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminImageManager } from "@/components/admin-image-manager";

export default function NewHousePage() {
    const [formData, setFormData] = useState({
        number: "",
        street: "",
        postal_code: "",
        description: "",
        is_active: true,
    });

    const [newImages, setNewImages] = useState<File[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (!formData.number || isNaN(Number(formData.number))) {
            return "House number must be a valid number.";
        }
        if (!formData.street.trim()) {
            return "Street name is required.";
        }
        if (!formData.postal_code.trim()) {
            return "Postal code is required.";
        }
        if (!formData.description.trim()) {
            return "Description is required.";
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

            // Generate a UUID for the house
            const houseId = uuidv4();

            // Upload images to storage bucket
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

            // Insert house data into the database
            const { error: insertError } = await supabase.from("houses").insert({
                id: houseId,
                number: Number(formData.number),
                street: formData.street.trim(),
                postal_code: formData.postal_code.trim(),
                description: formData.description.trim(),
                images: uploadedImageUrls,
                is_active: formData.is_active,
            });

            if (insertError) {
                throw new Error(insertError.message);
            }

            router.push("/admin/houses");
        } catch (err: unknown) {
            setError((err as Error).message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    // Adjust the layout to occupy more width and make it responsive
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-8 md:px-12 lg:px-20 xl:px-32">
            <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin/houses">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Houses
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Create New House</h1>
                    </div>

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

                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleTextareaChange}
                                disabled={loading}
                                placeholder="Enter house description"
                                rows={4}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
                                disabled={loading}
                            />
                            <Label htmlFor="is_active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                House is active
                            </Label>
                        </div>

                        <AdminImageManager
                            currentImages={[]}
                            newImages={newImages}
                            onImageAdd={handleImageAdd}
                            onDeleteCurrentImage={() => { }} // No current images in new page
                            onDeleteNewImage={(index) => setNewImages((prev) => prev.filter((_, i) => i !== index))}
                            disabled={loading}
                            label="House Images"
                            placeholder="House Images"
                            entityType="house"
                        />

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Creating..." : "Create House"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}