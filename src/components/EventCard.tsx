import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Euro } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/services/apiClient';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title?: string;
  titre?: string;
  description?: string;
  description_long?: string;
  date?: string;
  date_debut?: string;
  endDate?: string;
  end_date?: string;
  time?: string;
  heure?: string;
  location?: string;
  lieu?: string;
  type?: string;
  status?: 'upcoming' | 'past';
  statut?: 'a_venir' | 'termine';
  maxParticipants?: number;
  max_participants?: number;
  currentParticipants?: number;
  current_participants?: number;
  image?: string;
  imageUrl?: string;
  image_url?: string;
  media_url?: string;
  media?: string;
  organizer?: string;
  isFree?: boolean;
  is_free?: boolean;
  price?: string | null;
  price_prix?: string | null;
  tags?: string[];
  tagsList?: string[];
}

interface EventCardProps {
  event: Event;
}

const isVideoUrl = (url?: string) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || /video\//i.test(url);
};

const EventCard = ({ event }: EventCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusVariant = (status?: string) => {
    return status === 'upcoming' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground';
  };

  const title = event.titre || event.title || 'Événement';
  const description = (event.description_long || event.description || '').slice(0, 140);

  // Determine media (prefer media_url for videos)
  const mediaCandidates = [
    (event as any).media_url,
    (event as any).media,
    (event as any).image_url,
    event.image,
    event.imageUrl
  ].filter(Boolean) as string[];

  const mediaUrl = mediaCandidates[0] || '';
  const showVideo = isVideoUrl(mediaUrl);
  const showImage = !!mediaUrl && !showVideo;

  const availableSpots = (event.max_participants ?? event.maxParticipants ?? 100) - (event.current_participants ?? event.currentParticipants ?? 0);
  const isFull = availableSpots <= 0;

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiClient.registerForEvent(event.id, formData as any);
      if ((result as any).success) {
        toast({
          title: "Inscription confirmée",
          description: (result as any).message,
        });
        setIsModalOpen(false);
        setFormData({ name: '', email: '' });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'inscription",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-3d">
        <div className="aspect-video relative overflow-hidden">
          {showVideo ? (
            <video
              src={mediaUrl}
              controls
              className="w-full h-48 object-cover"
              preload="metadata"
              playsInline
            />
          ) : showImage ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img src={mediaUrl} alt={title} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">Aucun visuel</div>
          )}

          <div className="absolute top-4 left-4 flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium animate-glow ${getStatusVariant(event.status || (event as any).statut)}`}>
              {event.status === 'upcoming' || (event as any).statut === 'a_venir' ? 'À venir' : 'Terminé'}
            </span>
            <Badge variant="outline" className="bg-background/90">
              {event.type || (event as any).type || 'Événement'}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold leading-tight">{title}</h3>

            <p className="text-muted-foreground text-sm">
              {description}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {formatDate(event.date || (event as any).date_debut)}
                  {event.end_date && event.end_date !== event.date && ` - ${formatDate(event.end_date)}`}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{event.time || (event as any).heure || ''}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.location || event.lieu || ''}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <span>
                  {(event.current_participants ?? event.currentParticipants ?? 0)}/{(event.max_participants ?? event.maxParticipants ?? 100)} participants
                  {isFull && <span className="text-destructive ml-1">(Complet)</span>}
                </span>
              </div>

              {!((event.is_free ?? event.isFree) ?? false) && (
                <div className="flex items-center space-x-2">
                  <Euro className="h-4 w-4 text-primary" />
                  <span>{event.price || (event as any).prix || ''}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {(event.tags || event.tagsList || []).slice(0, 6).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4">
            {((event.status === 'upcoming') || (event as any).statut === 'a_venir') && !isFull && (
              <Button onClick={() => setIsModalOpen(true)} className="w-full btn-hero button-3d">Je participe</Button>
            )}
            {((event.status === 'upcoming') || (event as any).statut === 'a_venir') && isFull && (
              <Button disabled className="w-full">Événement complet</Button>
            )}
            {((event.status === 'past') || (event as any).statut === 'termine') && (
              <Button disabled variant="outline" className="w-full">Événement terminé</Button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscription à l'événement</DialogTitle>
            <DialogDescription>{title}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} required />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={isLoading} className="btn-hero">
                {isLoading ? 'Inscription...' : 'Confirmer l\'inscription'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;