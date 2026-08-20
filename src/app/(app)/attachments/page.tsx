// coteadmin/src/app/(app)/attachments/page.tsx
import { cotebek } from '@/lib/cotebek';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { DeleteButton } from './DeleteButton';

type Attachment = {
  id: string; originalName: string; mimeType: string; fileSize: number;
  note: string | null; createdAt: string; uploadedByName: string | null;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function AttachmentsPage() {
  const res = await cotebek<{ data: Attachment[] }>('/attachments');
  const files = res.data;

  return (
    <div className="p-4 pb-24">
      <h1 className="text-lg font-semibold text-foreground mb-1">File Terupload</h1>
      <p className="text-sm text-muted-foreground mb-4">{files.length} file.</p>

      {files.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <FileText className="text-muted-foreground opacity-50 mb-3" size={32} />
          <p className="text-sm text-muted-foreground">Belum ada file yang diupload.</p>
        </div>
      )}

      <ul className="space-y-2">
        {files.map((f) => {
          const isImage = f.mimeType.startsWith('image/');
          return (
            <li key={f.id}>
              <Card className="shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <a
                      href={`/api/attachments/${f.id}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 flex-1 overflow-hidden hover:bg-muted/40 transition-colors"
                    >
                      {isImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`/api/attachments/${f.id}/view`}
                          alt={f.originalName}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileText size={20} />
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-medium text-foreground truncate">{f.originalName}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {f.uploadedByName ?? 'Tidak diketahui'} · {new Date(f.createdAt).toLocaleDateString('id-ID')} · {formatSize(f.fileSize)}
                        </div>
                        {f.note && <div className="text-xs text-muted-foreground/80 italic truncate mt-0.5">{f.note}</div>}
                      </div>
                    </a>
                    <div className="flex items-center gap-1 pr-3 pl-1 shrink-0 border-l border-border/50">
                      <a
                        href={`/api/attachments/${f.id}/download`}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        aria-label="Download"
                      >
                        <Download size={15} />
                      </a>
                      <DeleteButton id={f.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}