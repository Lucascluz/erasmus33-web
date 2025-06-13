"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
    address: string;
}

export function ImageGallery({ images, address }: ImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Check if images are available
    const hasImages = images?.length > 0;
    const displayImages = hasImages ? images : [];
    const selectedImage = hasImages ? displayImages[selectedImageIndex] : null;

    const nextImage = () => {
        if (!hasImages) return;
        setSelectedImageIndex((prev) => (prev + 1) % displayImages.length);
    };

    const prevImage = () => {
        if (!hasImages) return;
        setSelectedImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

    return (
        <>
            <div className="space-y-4">
                {/* Main Image */}
                <div className="relative group">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        {hasImages ? (
                            <Image
                                src={selectedImage!}
                                alt={`House at ${address} - Image ${selectedImageIndex + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                <div className="text-center text-muted-foreground">
                                    <div className="text-lg font-medium">No images available</div>
                                    <div className="text-sm">Images for this property are not currently available</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation arrows for main image */}
                    {hasImages && displayImages.length > 1 && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                                onClick={nextImage}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </>
                    )}

                    {/* Expand button */}
                    {hasImages && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsFullscreen(true)}
                        >
                            <Expand className="w-4 h-4" />
                        </Button>
                    )}

                    {/* Image counter */}
                    {hasImages && displayImages.length > 1 && (
                        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1 text-sm">
                            {selectedImageIndex + 1} / {displayImages.length}
                        </div>
                    )}
                </div>

                {/* Thumbnail Grid */}
                {hasImages && displayImages.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {displayImages.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${index === selectedImageIndex
                                    ? "border-primary"
                                    : "border-transparent hover:border-muted-foreground"
                                    }`}
                            >
                                <Image
                                    src={image}
                                    alt={`House at ${address} - Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {hasImages && isFullscreen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                    <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center p-4">
                        <Image
                            src={selectedImage!}
                            alt={`House at ${address} - Image ${selectedImageIndex + 1}`}
                            width={800}
                            height={600}
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Close button */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsFullscreen(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>

                        {/* Navigation in fullscreen */}
                        {displayImages.length > 1 && (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                    onClick={nextImage}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </>
                        )}

                        {/* Counter in fullscreen */}
                        {displayImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1 text-sm">
                                {selectedImageIndex + 1} / {displayImages.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
