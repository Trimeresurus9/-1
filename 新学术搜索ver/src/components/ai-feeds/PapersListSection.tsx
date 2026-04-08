import React from 'react';
import { Clock3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type { FeedPaperItem } from './RecommendedPapers';

export function PapersListSection({
  title,
  description,
  papers,
}: {
  title: string;
  description: string;
  papers: FeedPaperItem[];
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-4">
        {papers.map((paper, index) => (
          <Card key={paper.id} className="gap-0 border-border/70 bg-background shadow-sm">
            <CardHeader className="gap-3 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" />
                    Newest {index + 1}
                  </div>
                  <CardTitle className="text-base font-semibold leading-6 text-foreground">{paper.title}</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:bg-accent active:scale-[0.98]"
                >
                  Preview
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{paper.meta}</p>
              <p className="text-sm leading-6 text-foreground/80">{paper.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
