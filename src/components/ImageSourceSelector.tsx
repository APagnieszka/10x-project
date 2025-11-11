import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ImageSourceSelectorProps {
  onSelectCamera: () => void;
  onSelectGallery: () => void;
  onCancel: () => void;
  title: string;
  description: string;
}

/**
 * ImageSourceSelector - allows user to choose between camera and gallery
 * Used for both OCR scanning and barcode scanning
 */
export function ImageSourceSelector({
  onSelectCamera,
  onSelectGallery,
  onCancel,
  title,
  description,
}: ImageSourceSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={onSelectCamera} variant="default" className="w-full py-6 text-lg" size="lg">
            📷 Take Photo with Camera
          </Button>
          <Button onClick={onSelectGallery} variant="outline" className="w-full py-6 text-lg" size="lg">
            🖼️ Choose from Gallery
          </Button>
          <Button onClick={onCancel} variant="ghost" className="w-full mt-4">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
