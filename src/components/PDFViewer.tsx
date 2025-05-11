
import React, { useState } from 'react';
import { FileText, Download, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface PDFViewerProps {
  title: string;
  pdfUrl: string;
  fileSize: string;
  isOpen: boolean;
  onClose: () => void;
}

const PDFViewer = ({ title, pdfUrl, fileSize, isOpen, onClose }: PDFViewerProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    // Create a temporary link to download the PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      description: "PDF downloaded successfully!",
      duration: 3000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>File size: {fileSize}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-[400px] border rounded-md overflow-hidden bg-gray-50 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Loading PDF...</p>
              </div>
            </div>
          )}
          <iframe 
            src={`${pdfUrl}#toolbar=0&navpanes=0`} 
            className="w-full h-full"
            title={title}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        
        <DialogFooter className="flex sm:justify-between gap-4 flex-col sm:flex-row">
          <div className="flex gap-2">
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </a>
            </Button>
          </div>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
