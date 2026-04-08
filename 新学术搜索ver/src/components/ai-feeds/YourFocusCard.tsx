import React from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function YourFocusCard({
  tags,
}: {
  tags: string[];
}) {
  return (
    <Card className="gap-0 border-border/70 bg-background shadow-sm">
      <CardHeader className="gap-2 pb-4">
        <CardTitle className="text-base font-semibold text-foreground">Your Focus</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Interests used to shape recommendations in this workspace.
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-xs">
            {tag}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}
