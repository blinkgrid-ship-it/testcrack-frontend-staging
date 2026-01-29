import { Construction, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
export default function FeaturePending() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md px-6 text-center">
        {/* Animated Icon */}
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Construction className="h-10 w-10 text-primary" />
          </div>
          <Sparkles className="absolute -right-1 -top-1 h-6 w-6 text-warning animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold text-foreground">
          Feature Under Development
        </h1>

        {/* Description */}
        <p className="mb-2 text-muted-foreground">
          We're working hard to bring you this feature. It will be available in an upcoming release.
        </p>
        <p className="mb-8 text-sm text-muted-foreground/70">
          Stay tuned for updates on Settings, Notifications, and more advanced instructor tools.
        </p>

        {/* Progress Indicator */}
        <div className="mb-8 rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Development Progress</span>
            <span className="text-primary">65%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
              style={{ width: '65%' }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Estimated release: Q2 2025
          </p>
        </div>

        {/* Action Button */}
        <Link to="/">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}