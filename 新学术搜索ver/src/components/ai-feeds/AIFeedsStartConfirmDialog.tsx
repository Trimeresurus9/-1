import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { useLanguage } from '../../contexts/LanguageContext';

export function AIFeedsStartConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-[28px] border-border/70 p-0">
        <div className="p-6 sm:p-7">
          <DialogHeader className="space-y-3 text-left">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
              {t('aiFeeds.serviceConfirm.eyebrow')}
            </Badge>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
                {t('aiFeeds.serviceConfirm.title')}
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-muted-foreground">
                {t('aiFeeds.serviceConfirm.description')}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="mt-6 grid gap-3">
            {[
              t('aiFeeds.serviceConfirm.point.background'),
              t('aiFeeds.serviceConfirm.point.credits'),
              t('aiFeeds.serviceConfirm.point.leavePage'),
              t('aiFeeds.serviceConfirm.point.pauseAnytime'),
              t('aiFeeds.serviceConfirm.point.lowCredits'),
            ].map((point) => (
              <div key={point} className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-sm leading-6 text-foreground/88">
                {point}
              </div>
            ))}
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t('aiFeeds.serviceConfirm.cancel')}
            </Button>
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onConfirm();
              }}
            >
              {t('aiFeeds.serviceConfirm.confirm')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
