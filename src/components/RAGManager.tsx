import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useVSCodeAuth } from '@/hooks/use-vscode-auth';
import { storeDocument, getUserDocumentCount, deleteUserDocuments } from '@/lib/rag';
import { Upload, Trash, Database } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function RAGManager() {
  const { authState } = useVSCodeAuth();
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [documentCount, setDocumentCount] = useState<number | null>(null);

  const loadDocumentCount = async () => {
    if (!authState.user?.id) return;
    
    try {
      const count = await getUserDocumentCount(authState.user.id);
      setDocumentCount(count);
    } catch (error) {
      console.error('Error loading document count:', error);
    }
  };

  const handleUpload = async () => {
    if (!content.trim() || !authState.user?.id) return;

    setIsUploading(true);
    try {
      await storeDocument(authState.user.id, content, {
        source: 'manual_upload',
        timestamp: new Date().toISOString(),
      });

      toast.success('Document uploaded successfully');
      setContent('');
      await loadDocumentCount();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearAll = async () => {
    if (!authState.user?.id) return;

    if (!confirm('Are you sure you want to delete all stored documents?')) {
      return;
    }

    try {
      await deleteUserDocuments(authState.user.id);
      toast.success('All documents deleted');
      setDocumentCount(0);
    } catch (error) {
      console.error('Error deleting documents:', error);
      toast.error('Failed to delete documents');
    }
  };

  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          RAG Document Manager
        </CardTitle>
        <CardDescription>
          Upload documents to enhance AI responses with relevant context
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your document content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
        
        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={!content.trim() || isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>

          {documentCount !== null && documentCount > 0 && (
            <Button
              onClick={handleClearAll}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash className="w-4 h-4" />
              Clear All ({documentCount})
            </Button>
          )}

          <Button
            onClick={loadDocumentCount}
            variant="outline"
            className="ml-auto"
          >
            Refresh Count
          </Button>
        </div>

        {documentCount !== null && (
          <p className="text-sm text-muted-foreground">
            You have {documentCount} document{documentCount !== 1 ? 's' : ''} stored
          </p>
        )}
      </CardContent>
    </Card>
  );
}
