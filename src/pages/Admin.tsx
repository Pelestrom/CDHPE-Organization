import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  FileText,
  Calendar,
  Users,
  Image,
  MessageSquare,
  Settings,
  Activity,
  Plus,
  Edit as EditIcon,
  Trash2,
  Save,
  FolderTree
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';
import FileUploader from '@/components/FileUploader';
import type {
  Publication,
  Event,
  Category,
  Team,
  EventType,
  Media,
  Participant,
  Message,
  SupportInfo,
  AdminLog
} from '@/services/supabaseClient';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('publications');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Data states
  const [publications, setPublications] = useState<Publication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [supportInfo, setSupportInfo] = useState<SupportInfo[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);

  // Modal states
  const [showPublicationModal, setShowPublicationModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingEventType, setEditingEventType] = useState<EventType | null>(null);

  // Form states
  const [publicationForm, setPublicationForm] = useState({
    titre: '',
    chapeau: '',
    contenu_long: '',
    type_media_principal: 'texte' as 'texte' | 'image' | 'video' | 'audio',
    categorie_id: '',
    equipe_id: '',
    featured: false,
    published: true,
    image_url: '',
    media_url: '',
  });

  const [eventForm, setEventForm] = useState({
    titre: '',
    description_long: '',
    statut: 'a_venir' as 'a_venir' | 'termine',
    date_debut: '',
    date_fin: '',
    heure: '',
    lieu: '',
    type_event_id: '',
    keywords: [] as string[],
    keywordInput: '',
    max_participants: 100,
    unlimited_participants: false,
    prix: '',
    gratuit: true,
    image_url: '',
    media_url: '',
  });

  const [categoryForm, setCategoryForm] = useState({ nom: '', description: '' });
  const [teamForm, setTeamForm] = useState({ nom: '', description: '' });
  const [eventTypeForm, setEventTypeForm] = useState({ nom: '', description: '' });

  useEffect(() => {
    if (isAuthenticated) loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isValid = await apiService.adminLogin(password);
      if (isValid) {
        setIsAuthenticated(true);
        toast({ title: 'Connexion réussie', description: "Bienvenue dans l'interface d'administration" });
        await loadAllData();
      } else {
        toast({ title: 'Accès refusé', description: 'Mot de passe incorrect', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur', description: 'Erreur de connexion', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Load all data
  const loadAllData = async () => {
    try {
      const [
        publicationsData,
        eventsData,
        categoriesData,
        teamsData,
        eventTypesData,
        mediaData,
        participantsData,
        messagesData,
        supportInfoData,
        logsData
      ] = await Promise.all([
        apiService.adminGetPublications(),
        apiService.adminGetEvents(),
        apiService.getCategories(),
        apiService.getTeams(),
        apiService.getEventTypes(),
        apiService.adminGetMedia(),
        apiService.adminGetParticipants(),
        apiService.adminGetMessages(),
        apiService.adminGetSupportInfo(),
        apiService.adminGetLogs()
      ]);
      setPublications(publicationsData);
      setEvents(eventsData);
      setCategories(categoriesData);
      setTeams(teamsData);
      setEventTypes(eventTypesData);
      setMedia(mediaData);
      setParticipants(participantsData);
      setMessages(messagesData);
      setSupportInfo(supportInfoData);
      setLogs(logsData);
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors du chargement des données', variant: 'destructive' });
    }
  };

  // Media handler
  const handleFileUpload = async (file: File) => {
    try {
      const uploaded = await apiService.adminUploadMedia(file);
      setMedia((prev) => [uploaded, ...prev]);
      toast({ title: 'Fichier uploadé' });
      return uploaded;
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
      throw err;
    }
  };

  // Reset forms
  const resetPublicationForm = () => {
    setPublicationForm({
      titre: '',
      chapeau: '',
      contenu_long: '',
      type_media_principal: 'texte',
      categorie_id: '',
      equipe_id: '',
      featured: false,
      published: true,
      image_url: '',
      media_url: '',
    });
    setEditingPublication(null);
  };

  const resetEventForm = () => {
    setEventForm({
      titre: '',
      description_long: '',
      statut: 'a_venir',
      date_debut: '',
      date_fin: '',
      heure: '',
      lieu: '',
      type_event_id: '',
      keywords: [],
      keywordInput: '',
      max_participants: 100,
      unlimited_participants: false,
      prix: '',
      gratuit: true,
      image_url: '',
      media_url: '',
    });
    setEditingEvent(null);
  };

  // Open edit
  const openEditPublication = (pub: Publication) => {
    const title = (pub as any).titre || (pub as any).title || '';
    const summary = (pub as any).chapeau || (pub as any).summary || '';
    const content = (pub as any).contenu_long || (pub as any).content || '';
    let typeMedia = (pub as any).type_media_principal || (pub as any).type || '';
    if (typeMedia === 'text') typeMedia = 'texte';
    if (typeMedia === 'photo') typeMedia = 'image';
    const imageUrl = (pub as any).image_url || (pub as any).media_url || '';

    setEditingPublication(pub);
    setPublicationForm({
      titre: title,
      chapeau: summary,
      contenu_long: content,
      type_media_principal: (typeMedia as any) || 'texte',
      categorie_id: (pub as any).categorie_id || (pub as any).category_id || '',
      equipe_id: (pub as any).equipe_id || (pub as any).team_id || '',
      featured: (pub as any).featured ?? false,
      published: (pub as any).published ?? true,
      image_url: imageUrl || '',
      media_url: (pub as any).media_url || ''
    });
    setShowPublicationModal(true);
  };

  const openEditEvent = (evt: Event) => {
    const maxParticipants = (evt as any).max_participants || 100;
    
    setEditingEvent(evt);
    setEventForm({
      titre: (evt as any).titre || (evt as any).title || '',
      description_long: (evt as any).description_long || (evt as any).description || '',
      statut: (evt as any).statut || (evt as any).status === 'upcoming' ? 'a_venir' : 'termine',
      date_debut: (evt as any).date_debut || (evt as any).date || '',
      date_fin: (evt as any).date_fin || (evt as any).end_date || '',
      heure: (evt as any).heure || (evt as any).time || '',
      lieu: (evt as any).lieu || (evt as any).location || '',
      type_event_id: (evt as any).type_event_id || '',
      keywords: (evt as any).keywords || [],
      keywordInput: '',
      max_participants: maxParticipants,
      unlimited_participants: maxParticipants === 0,
      prix: (evt as any).prix || (evt as any).price || '',
      gratuit: (evt as any).gratuit ?? (evt as any).is_free ?? true,
      image_url: (evt as any).image_url || '',
      media_url: (evt as any).media_url || '',
    });
    setShowEventModal(true);
  };

  // Keywords
  const addKeyword = () => {
    if (eventForm.keywordInput.trim() && eventForm.keywords.length < 4) {
      setEventForm({
        ...eventForm,
        keywords: [...eventForm.keywords, eventForm.keywordInput.trim()],
        keywordInput: '',
      });
    }
  };

  const removeKeyword = (index: number) => {
    setEventForm({
      ...eventForm,
      keywords: eventForm.keywords.filter((_, i) => i !== index),
    });
  };

  // Publication handlers
  const handleSavePublication = async () => {
    try {
      if (editingPublication) {
        const updated = await apiService.adminUpdatePublication(editingPublication.id, publicationForm);
        setPublications(publications.map((p) => (p.id === editingPublication.id ? updated : p)));
        toast({ title: 'Publication mise à jour avec succès' });
      } else {
        const created = await apiService.adminCreatePublication(publicationForm);
        setPublications([created, ...publications]);
        toast({ title: 'Publication créée avec succès' });
      }
      setShowPublicationModal(false);
      resetPublicationForm();
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
      console.error('Save publication error:', err);
    }
  };

  // Event handlers
  const handleSaveEvent = async () => {
    try {
      const eventData = {
        ...eventForm,
        max_participants: eventForm.unlimited_participants ? 0 : eventForm.max_participants
      };

      if (editingEvent) {
        const updated = await apiService.adminUpdateEvent(editingEvent.id, eventData);
        setEvents(events.map((e) => (e.id === editingEvent.id ? updated : e)));
        toast({ title: "Événement mis à jour" });
      } else {
        const created = await apiService.adminCreateEvent(eventData);
        setEvents([created, ...events]);
        toast({ title: "Événement créé" });
      }
      setShowEventModal(false);
      resetEventForm();
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
      console.error('Save event error:', err);
    }
  };

  // Delete handlers
  const handleDeletePublication = async (id: string) => {
    if (!confirm('Supprimer cette publication ?')) return;
    try {
      await apiService.adminDeletePublication(id);
      setPublications(publications.filter((p) => p.id !== id));
      toast({ title: 'Publication supprimée' });
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return;
    try {
      await apiService.adminDeleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
      toast({ title: 'Événement supprimé' });
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  // Category/Team/EventType handlers
  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        const updated = await apiService.adminUpdateCategory(editingCategory.id, categoryForm);
        setCategories(categories.map((c) => (c.id === editingCategory.id ? updated : c)));
        toast({ title: 'Catégorie mise à jour' });
      } else {
        const created = await apiService.adminCreateCategory(categoryForm);
        setCategories([created, ...categories]);
        toast({ title: 'Catégorie créée' });
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ nom: '', description: '' });
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleSaveTeam = async () => {
    try {
      if (editingTeam) {
        const updated = await apiService.adminUpdateTeam(editingTeam.id, teamForm);
        setTeams(teams.map((t) => (t.id === editingTeam.id ? updated : t)));
        toast({ title: 'Équipe mise à jour' });
      } else {
        const created = await apiService.adminCreateTeam(teamForm);
        setTeams([created, ...teams]);
        toast({ title: 'Équipe créée' });
      }
      setShowTeamModal(false);
      setEditingTeam(null);
      setTeamForm({ nom: '', description: '' });
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleSaveEventType = async () => {
    try {
      if (editingEventType) {
        const updated = await apiService.adminUpdateEventType(editingEventType.id, eventTypeForm);
        setEventTypes(eventTypes.map((et) => (et.id === editingEventType.id ? updated : et)));
        toast({ title: 'Type d\'événement mis à jour' });
      } else {
        const created = await apiService.adminCreateEventType(eventTypeForm);
        setEventTypes([created, ...eventTypes]);
        toast({ title: 'Type d\'événement créé' });
      }
      setShowEventTypeModal(false);
      setEditingEventType(null);
      setEventTypeForm({ nom: '', description: '' });
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  // Render login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Administration CDHPE</CardTitle>
            <CardDescription>Accès réservé aux administrateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Administration CDHPE</h1>
              <p className="text-muted-foreground">Interface de gestion du contenu</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>Voir le site</Button>
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Déconnexion</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="publications"><FileText className="w-4 h-4 mr-2" />Publications</TabsTrigger>
            <TabsTrigger value="events"><Calendar className="w-4 h-4 mr-2" />Événements</TabsTrigger>
            <TabsTrigger value="participants"><Users className="w-4 h-4 mr-2" />Participants</TabsTrigger>
            <TabsTrigger value="media"><Image className="w-4 h-4 mr-2" />Médias</TabsTrigger>
            <TabsTrigger value="messages"><MessageSquare className="w-4 h-4 mr-2" />Messages</TabsTrigger>
            <TabsTrigger value="settings"><FolderTree className="w-4 h-4 mr-2" />Paramètres</TabsTrigger>
            <TabsTrigger value="logs"><Activity className="w-4 h-4 mr-2" />Logs</TabsTrigger>
          </TabsList>

          {/* Publications Tab */}
          <TabsContent value="publications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Publications</h2>
              <Button onClick={() => { resetPublicationForm(); setShowPublicationModal(true); }}>
                <Plus className="w-4 h-4 mr-2" />Nouvelle Publication
              </Button>
            </div>
            <div className="grid gap-4">
              {publications.map((pub) => (
                <Card key={pub.id}>
                  <CardContent className="p-6">
                    {(pub as any).image_url && (
                      <img src={(pub as any).image_url} alt={(pub as any).title || (pub as any).titre} className="w-full h-32 object-cover rounded mb-4" />
                    )}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{(pub as any).titre || (pub as any).title}</h3>
                          {(pub as any).featured && <Badge variant="secondary">À la une</Badge>}
                          {!(pub as any).published && <Badge variant="outline">Brouillon</Badge>}
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{(pub as any).chapeau || (pub as any).summary}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Catégorie: {(pub as any).categorie_nom || (pub as any).category || 'Non définie'}</span>
                          <span>Équipe: {(pub as any).equipe_nom || 'Non définie'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditPublication(pub)}>
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeletePublication(pub.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Événements</h2>
              <Button onClick={() => { resetEventForm(); setShowEventModal(true); }}>
                <Plus className="w-4 h-4 mr-2" />Nouvel Événement
              </Button>
            </div>
            <div className="grid gap-4">
              {events.map((evt) => (
                <Card key={evt.id}>
                  <CardContent className="p-6">
                    {evt.image_url && (
                      <img src={evt.image_url} alt={evt.titre} className="w-full h-32 object-cover rounded mb-4" />
                    )}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{evt.titre}</h3>
                          <Badge variant={evt.statut === 'a_venir' ? 'default' : 'secondary'}>
                            {evt.statut === 'a_venir' ? 'À venir' : 'Terminé'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {evt.description_long ? evt.description_long.substring(0, 150) : 'Aucune description'}...
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>📅 {evt.date_debut ? new Date(evt.date_debut).toLocaleDateString('fr-FR') : '—'}</span>
                          <span>📍 {evt.lieu || '—'}</span>
                          {(evt as any).event_types && <span>Type: {(evt as any).event_types.nom}</span>}
                          <span>👥 {evt.max_participants === 0 ? 'Illimité' : `${evt.participants_count || 0}/${evt.max_participants}`}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditEvent(evt)}>
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(evt.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <h2 className="text-xl font-semibold">Galerie multimédia</h2>
            <FileUploader onUpload={handleFileUpload} multiple />
            <div className="grid grid-cols-3 gap-4">
              {media.map((m) => (
                <Card key={m.id}>
                  <CardContent className="p-4">
                    {m.type === 'image' && (
                      <img src={m.url} alt={m.nom_fichier} className="w-full h-32 object-cover rounded" />
                    )}
                    {m.type === 'video' && (
                      <div className="relative w-full h-32">
                        <video 
                          src={m.url} 
                          controls 
                          className="w-full h-32 object-cover rounded"
                          preload="metadata"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          Vidéo
                        </div>
                      </div>
                    )}
                    {m.type === 'audio' && (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded">
                        <audio src={m.url} controls className="w-full" />
                      </div>
                    )}
                    {m.type === 'document' && (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <p className="text-sm mt-2 truncate">{m.nom_fichier}</p>
                    <p className="text-xs text-muted-foreground capitalize">{m.type}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => apiService.adminDeleteMedia(m.id).then(() => setMedia(media.filter(me => me.id !== m.id)))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages / Settings / Logs tabs omitted for brevity */}

        </Tabs>
      </div>

      {/* Publication Modal */}
      <Dialog open={showPublicationModal} onOpenChange={setShowPublicationModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPublication ? 'Modifier' : 'Créer'} une Publication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input value={publicationForm.titre} onChange={(e) => setPublicationForm({ ...publicationForm, titre: e.target.value })} />
            </div>
            <div>
              <Label>Chapeau (résumé court)</Label>
              <Textarea value={publicationForm.chapeau} onChange={(e) => setPublicationForm({ ...publicationForm, chapeau: e.target.value })} />
            </div>
            <div>
              <Label>Contenu long</Label>
              <Textarea rows={10} value={publicationForm.contenu_long} onChange={(e) => setPublicationForm({ ...publicationForm, contenu_long: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type de média</Label>
                <Select value={publicationForm.type_media_principal} onValueChange={(v: any) => setPublicationForm({ ...publicationForm, type_media_principal: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="texte">Texte</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select
                  value={publicationForm.categorie_id}
                  onValueChange={(v) => setPublicationForm({ ...publicationForm, categorie_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Équipe</Label>
              <Select
                value={publicationForm.equipe_id}
                onValueChange={(v) => setPublicationForm({ ...publicationForm, equipe_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une équipe">
                    {publicationForm.equipe_id ? 
                      teams.find(t => t.id === publicationForm.equipe_id)?.nom : 
                      "Sélectionner une équipe"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={publicationForm.featured} onCheckedChange={(v) => setPublicationForm({ ...publicationForm, featured: v })} />
                <Label>À la une</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={publicationForm.published} onCheckedChange={(v) => setPublicationForm({ ...publicationForm, published: v })} />
                <Label>Publié</Label>
              </div>
            </div>

            <FileUploader
              onUpload={async (file) => {
                const m = await handleFileUpload(file);
                if (m.type === 'image') {
                  setPublicationForm({ ...publicationForm, image_url: m.url, media_url: '' });
                  setPublicationForm(prev => ({ ...prev, type_media_principal: 'image' }));
                } else if (m.type === 'video') {
                  setPublicationForm({ ...publicationForm, media_url: m.url, image_url: '' });
                  setPublicationForm(prev => ({ ...prev, type_media_principal: 'video' }));
                } else if (m.type === 'audio') {
                  setPublicationForm({ ...publicationForm, media_url: m.url, image_url: '' });
                  setPublicationForm(prev => ({ ...prev, type_media_principal: 'audio' }));
                } else {
                  setPublicationForm({ ...publicationForm, media_url: m.url });
                }
              }}
              acceptedTypes={['image/*', 'video/*', 'audio/*', '*/*']}
              maxSize={30}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublicationModal(false)}>Annuler</Button>
            <Button onClick={handleSavePublication}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Modifier' : 'Créer'} un Événement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input value={eventForm.titre} onChange={(e) => setEventForm({ ...eventForm, titre: e.target.value })} />
            </div>
            <div>
              <Label>Description longue</Label>
              <Textarea rows={6} value={eventForm.description_long} onChange={(e) => setEventForm({ ...eventForm, description_long: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date de début</Label>
                <Input type="date" value={eventForm.date_debut} onChange={(e) => setEventForm({ ...eventForm, date_debut: e.target.value })} />
              </div>
              <div>
                <Label>Date de fin (optionnel)</Label>
                <Input type="date" value={eventForm.date_fin} onChange={(e) => setEventForm({ ...eventForm, date_fin: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Heure</Label>
                <Input type="time" value={eventForm.heure} onChange={(e) => setEventForm({ ...eventForm, heure: e.target.value })} />
              </div>
              <div>
                <Label>Lieu</Label>
                <Input value={eventForm.lieu} onChange={(e) => setEventForm({ ...eventForm, lieu: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type d'événement</Label>
                <Select value={eventForm.type_event_id} onValueChange={(v) => setEventForm({ ...eventForm, type_event_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((et) => (
                      <SelectItem key={et.id} value={et.id}>{et.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut</Label>
                <Select value={eventForm.statut} onValueChange={(v: any) => setEventForm({ ...eventForm, statut: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_venir">À venir</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Mots-clés (max 4)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={eventForm.keywordInput}
                  onChange={(e) => setEventForm({ ...eventForm, keywordInput: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                  placeholder="Ajouter un mot-clé"
                  disabled={eventForm.keywords.length >= 4}
                />
                <Button type="button" onClick={addKeyword} disabled={eventForm.keywords.length >= 4}>Ajouter</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {eventForm.keywords.map((kw, i) => (
                  <Badge key={i} variant="secondary">
                    {kw}
                    <button onClick={() => removeKeyword(i)} className="ml-2">×</button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={eventForm.gratuit} 
                  onCheckedChange={(v) => setEventForm({ ...eventForm, gratuit: v })} 
                />
                <Label>Gratuit</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={eventForm.unlimited_participants} 
                  onCheckedChange={(v) => setEventForm({ 
                    ...eventForm, 
                    unlimited_participants: v,
                    max_participants: v ? 0 : 100
                  })} 
                />
                <Label>Nombre illimité de participants</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Participants max</Label>
                <Input 
                  type="number" 
                  value={eventForm.max_participants} 
                  onChange={(e) => setEventForm({ ...eventForm, max_participants: parseInt(e.target.value || '0') })} 
                  disabled={eventForm.unlimited_participants}
                  placeholder={eventForm.unlimited_participants ? "Illimité" : ""}
                />
              </div>
              <div>
                <Label>Prix</Label>
                <Input value={eventForm.prix} onChange={(e) => setEventForm({ ...eventForm, prix: e.target.value })} disabled={eventForm.gratuit} />
              </div>
            </div>

            <FileUploader
              onUpload={async (file) => {
                const m = await handleFileUpload(file);
                if (m.type === 'image') {
                  setEventForm({ ...eventForm, image_url: m.url });
                } else {
                  setEventForm({ ...eventForm, media_url: m.url });
                }
              }}
              acceptedTypes={['image/*', 'video/*', 'audio/*', '*/*']}
              maxSize={20}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventModal(false)}>Annuler</Button>
            <Button onClick={handleSaveEvent}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;