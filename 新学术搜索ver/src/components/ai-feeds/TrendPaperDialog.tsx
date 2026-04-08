import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendPaper } from '../../data/mockTrends';

interface TrendPaperDialogProps {
  paper: TrendPaper | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrendPaperDialog({ paper, open, onOpenChange }: TrendPaperDialogProps) {
  if (!paper) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-slate-200 bg-white p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full border-slate-300 bg-slate-50 text-slate-600">
              {paper.venue} {paper.year}
            </Badge>
            <Badge variant="outline" className="rounded-full border-slate-300 bg-slate-50 text-slate-600">
              {paper.citations} citations
            </Badge>
          </div>
          <DialogTitle className="text-xl leading-7 text-slate-900">{paper.title}</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-slate-600">
            {paper.authors.join(', ')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 pb-6">
          <section className="pt-1">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
              <FileText className="h-4 w-4" />
              <span>Paper summary</span>
            </div>
            <p className="text-sm leading-7 text-slate-600">{paper.summary}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-medium text-slate-900">Why it matters for this trend</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">{paper.relevanceNote}</p>
          </section>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-slate-700">
              <ExternalLink className="h-4 w-4" />
              Open paper
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
