import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { History, Star, Clock, Trash2, Play } from 'lucide-react';
import {
  getTimerHistory,
  getFavorites,
  getRecentTimers,
  getMostUsedTimers,
  toggleFavorite,
  deleteHistoryItem,
  clearHistory,
  type TimerHistoryItem,
} from '../utils/historyUtils';
import { formatTimerDisplay, formatDurationNatural } from '../utils/timeUtils';

interface TimerHistoryProps {
  onSelectTimer: (item: TimerHistoryItem) => void;
}

export function TimerHistory({ onSelectTimer }: TimerHistoryProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<TimerHistoryItem[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const loadHistory = () => {
    setHistory(getTimerHistory());
  };

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open]);

  const handleToggleFavorite = (itemId: string) => {
    toggleFavorite(itemId);
    loadHistory();
  };

  const handleDelete = (itemId: string) => {
    deleteHistoryItem(itemId);
    loadHistory();
  };

  const handleClearHistory = () => {
    clearHistory();
    loadHistory();
    setShowClearDialog(false);
  };

  const handleSelectTimer = (item: TimerHistoryItem) => {
    onSelectTimer(item);
    setOpen(false);
  };

  const favorites = getFavorites();
  const recent = getRecentTimers(15);
  const mostUsed = getMostUsedTimers(15);

  const renderTimerItem = (item: TimerHistoryItem) => (
    <div
      key={item.id}
      className="flex items-center gap-2 p-2.5 rounded-xl border bg-card/60 backdrop-blur-md hover:bg-card/80 hover:shadow-md transition-all group"
    >
      <button
        onClick={() => handleSelectTimer(item)}
        className="flex-1 flex items-center gap-2 text-left min-w-0"
      >
        <div className="flex-shrink-0">
          <div className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
            {formatTimerDisplay(item.totalSeconds)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {item.label && (
            <p className="font-medium truncate text-sm">{item.label}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDurationNatural(item.duration)} • {item.useCount}x
          </p>
        </div>
      </button>
      
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => handleToggleFavorite(item.id)}
          aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={`h-3.5 w-3.5 ${
              item.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
            }`}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleDelete(item.id)}
          aria-label="Delete timer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2" size="lg">
            <History className="h-4 w-4" />
            History
            {favorites.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs">
                {favorites.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>Timer History</SheetTitle>
            <SheetDescription>
              Your recent timers and favorites
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-3 flex-1 overflow-hidden flex flex-col">
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No timer history yet</p>
                <p className="text-sm mt-1">Start a timer to see it here</p>
              </div>
            ) : (
              <>
                <Tabs defaultValue="recent" className="w-full flex-1 flex flex-col overflow-hidden">
                  <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="favorites">
                      Favorites
                      {favorites.length > 0 && (
                        <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 h-4 text-xs">
                          {favorites.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                  </TabsList>

                  <TabsContent value="recent" className="mt-3 flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-3">
                      <div className="space-y-2">
                        {recent.map(renderTimerItem)}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="favorites" className="mt-3 flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-3">
                      {favorites.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Star className="h-10 w-10 mx-auto mb-2 opacity-50" />
                          <p>No favorites yet</p>
                          <p className="text-sm mt-1">Star timers to save them here</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {favorites.map(renderTimerItem)}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="popular" className="mt-3 flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-3">
                      <div className="space-y-2">
                        {mostUsed.map(renderTimerItem)}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                {history.length > 0 && (
                  <div className="pt-3 border-t flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowClearDialog(true)}
                      className="w-full gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear History (Keep Favorites)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear History?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all timer history except your favorites. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearHistory}>
              Clear History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
