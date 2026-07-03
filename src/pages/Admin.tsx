import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, LogOut, Loader2, Upload, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Head } from "vite-react-ssg";
import { renderFormattedText } from "@/lib/richText";

// ─── Media Upload ─────────────────────────────────────────────────────────────

type MediaUploadProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
};

const MediaUpload = ({ label, value, onChange, accept = "video/*,image/*", placeholder = "https://..." }: MediaUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const isUploaded = value && value.includes("supabase.co/storage");
  const isVideo = accept.includes("video");

  const handleFile = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    toast.success("Uploaded!");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Preview */}
      {isUploaded && (
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
          {isVideo
            ? <video src={value} controls className="max-h-40 w-full object-cover" />
            : <img src={value} alt="" className="max-h-40 w-full object-cover" />}
          <button type="button" onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Upload zone (shown when empty) */}
      {!value && (
        <button type="button" disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 py-6 text-muted-foreground transition hover:border-accent hover:bg-muted/70 disabled:opacity-50">
          {uploading
            ? <><Loader2 className="h-5 w-5 animate-spin" /><span className="text-xs">Uploading…</span></>
            : <><Upload className="h-5 w-5" /><span className="text-xs">Click to upload from laptop</span></>}
        </button>
      )}

      {/* URL input (always shown) */}
      {!isUploaded && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">or paste URL</span>
          <Input value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} className="flex-1 text-sm" />
          {value && (
            <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Fundraiser = {
  id: string; slug: string; name: string; age: number; city: string;
  need: string; story: string; goal: number; raised: number; donors: number;
  image_url: string | null; video_url: string | null;
};

type Webinar = {
  id: string; title: string; speaker: string | null; date: string | null;
  description: string | null; link: string | null; image_url: string | null;
};

type Story = {
  id: string; name: string; age: number | null; location: string | null;
  story: string; image_url: string | null; video_url: string | null;
};

// ─── Login ────────────────────────────────────────────────────────────────────

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Head>
        <title>Admin — Samaanya Foundation</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-serif text-3xl">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Samaanya Foundation</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
};

// ─── Fundraisers ──────────────────────────────────────────────────────────────

const emptyF = { name: "", age: "", city: "", need: "", story: "", goal: "", slug: "", image_url: "", video_url: "" };

const FundraisersSection = () => {
  const qc = useQueryClient();
  const [dialog, setDialog] = useState<{ open: boolean; item: Fundraiser | null }>({ open: false, item: null });
  const [form, setForm] = useState(emptyF);
  const [saving, setSaving] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-fundraisers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fundraisers").select("*").order("created_at");
      if (error) throw error;
      return data as Fundraiser[];
    },
  });

  const openAdd = () => { setForm(emptyF); setDialog({ open: true, item: null }); };
  const openEdit = (item: Fundraiser) => {
    setForm({
      name: item.name, age: String(item.age), city: item.city,
      need: item.need, story: item.story, goal: String(item.goal),
      slug: item.slug, image_url: item.image_url ?? "", video_url: item.video_url ?? "",
    });
    setDialog({ open: true, item });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name, age: Number(form.age), city: form.city, need: form.need,
      story: form.story, goal: Number(form.goal),
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      image_url: form.image_url || null,
      video_url: form.video_url || null,
    };
    const { error } = dialog.item
      ? await supabase.from("fundraisers").update(payload).eq("id", dialog.item.id)
      : await supabase.from("fundraisers").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(dialog.item ? "Updated!" : "Added!");
    qc.invalidateQueries({ queryKey: ["admin-fundraisers"] });
    qc.invalidateQueries({ queryKey: ["fundraisers"] });
    setDialog({ open: false, item: null });
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const { error } = await supabase.from("fundraisers").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted.");
    qc.invalidateQueries({ queryKey: ["admin-fundraisers"] });
    qc.invalidateQueries({ queryKey: ["fundraisers"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">Fundraisers</h2>
        <Button size="sm" onClick={openAdd}><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </div>

      {isLoading && <p className="mt-4 text-muted-foreground">Loading…</p>}

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.city} · ₹{item.raised.toLocaleString("en-IN")} raised of ₹{item.goal.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(item.id, item.name)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialog.open} onOpenChange={(o) => !o && setDialog({ open: false, item: null })}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {dialog.item ? "Edit Fundraiser" : "Add Fundraiser"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Age</Label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required /></div>
            </div>
            <div><Label>City</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City, State" required /></div>
            <div><Label>Need (short summary)</Label>
              <Input value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })} required /></div>
            <div><Label>Story</Label>
              <Textarea rows={4} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} required /></div>
            <div><Label>Goal (₹)</Label>
              <Input type="number" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} required /></div>
            <MediaUpload label="Photo (optional)" value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              accept="image/*" placeholder="https://... or upload from laptop" />
            <MediaUpload label="Video (optional)" value={form.video_url}
              onChange={(url) => setForm({ ...form, video_url: url })}
              accept="video/*" placeholder="https://youtube.com/... or upload from laptop" />
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : dialog.item ? "Save changes" : "Add fundraiser"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Webinars ─────────────────────────────────────────────────────────────────

const emptyW = { title: "", speaker: "", date: "", description: "", link: "", image_url: "" };

const WebinarsSection = () => {
  const qc = useQueryClient();
  const [dialog, setDialog] = useState<{ open: boolean; item: Webinar | null }>({ open: false, item: null });
  const [form, setForm] = useState(emptyW);
  const [saving, setSaving] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-webinars"],
    queryFn: async () => {
      const { data, error } = await supabase.from("webinars").select("*").order("date", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data as Webinar[];
    },
  });

  const openAdd = () => { setForm(emptyW); setDialog({ open: true, item: null }); };
  const openEdit = (item: Webinar) => {
    setForm({
      title: item.title, speaker: item.speaker ?? "", date: item.date ?? "",
      description: item.description ?? "", link: item.link ?? "", image_url: item.image_url ?? "",
    });
    setDialog({ open: true, item });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title, speaker: form.speaker || null, date: form.date || null,
      description: form.description || null, link: form.link || null, image_url: form.image_url || null,
    };
    const { error } = dialog.item
      ? await supabase.from("webinars").update(payload).eq("id", dialog.item.id)
      : await supabase.from("webinars").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(dialog.item ? "Updated!" : "Added!");
    qc.invalidateQueries({ queryKey: ["admin-webinars"] });
    qc.invalidateQueries({ queryKey: ["webinars"] });
    setDialog({ open: false, item: null });
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const { error } = await supabase.from("webinars").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted.");
    qc.invalidateQueries({ queryKey: ["admin-webinars"] });
    qc.invalidateQueries({ queryKey: ["webinars"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">Webinars</h2>
        <Button size="sm" onClick={openAdd}><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </div>

      {isLoading && <p className="mt-4 text-muted-foreground">Loading…</p>}

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.speaker ? `With ${item.speaker} · ` : ""}{item.date ?? "No date set"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(item.id, item.title)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialog.open} onOpenChange={(o) => !o && setDialog({ open: false, item: null })}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {dialog.item ? "Edit Webinar" : "Add Webinar"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div><Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div><Label>Speaker (optional)</Label>
              <Input value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} /></div>
            <div><Label>Date (optional)</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div><Label>Description (optional)</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Registration Link (optional)</Label>
              <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." /></div>
            <MediaUpload label="Banner Image (optional)" value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              accept="image/*" placeholder="https://... or upload from laptop" />
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : dialog.item ? "Save changes" : "Add webinar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

const emptyS = { name: "", age: "", location: "", story: "", image_url: "", video_url: "" };

const StoriesSection = () => {
  const qc = useQueryClient();
  const [dialog, setDialog] = useState<{ open: boolean; item: Story | null }>({ open: false, item: null });
  const [form, setForm] = useState(emptyS);
  const [saving, setSaving] = useState(false);
  const storyRef = useRef<HTMLTextAreaElement>(null);
  // Tapping the B/U button (outside the textarea) collapses the selection on mobile before
  // a click handler can read it, so we track the last real selection continuously instead.
  const lastSelection = useRef<{ start: number; end: number } | null>(null);

  const trackSelection = () => {
    const el = storyRef.current;
    if (!el) return;
    if (el.selectionStart !== el.selectionEnd) {
      lastSelection.current = { start: el.selectionStart, end: el.selectionEnd };
    }
  };

  const wrapSelection = (marker: string) => {
    const el = storyRef.current;
    const sel = lastSelection.current;
    if (!el || !sel || sel.start === sel.end) {
      toast.error("Select some text first, then tap Bold/Underline.");
      return;
    }
    const { start, end } = sel;
    const value = form.story;
    const selected = value.slice(start, end);
    // Tapping again on already-formatted text removes the markers instead of stacking them.
    const isWrapped = selected.startsWith(marker) && selected.endsWith(marker) && selected.length >= marker.length * 2;
    const replacement = isWrapped ? selected.slice(marker.length, -marker.length) : marker + selected + marker;
    const next = value.slice(0, start) + replacement + value.slice(end);
    setForm((f) => ({ ...f, story: next }));
    const newEnd = start + replacement.length;
    lastSelection.current = { start, end: newEnd };
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start, newEnd);
    });
  };

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-stories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stories").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Story[];
    },
  });

  const openAdd = () => { setForm(emptyS); setDialog({ open: true, item: null }); };
  const openEdit = (item: Story) => {
    setForm({
      name: item.name, age: item.age != null ? String(item.age) : "", location: item.location ?? "", story: item.story,
      image_url: item.image_url ?? "", video_url: item.video_url ?? "",
    });
    setDialog({ open: true, item });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name, age: form.age ? Number(form.age) : null, location: form.location || null, story: form.story,
      image_url: form.image_url || null, video_url: form.video_url || null,
    };
    const { error } = dialog.item
      ? await supabase.from("stories").update(payload).eq("id", dialog.item.id)
      : await supabase.from("stories").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(dialog.item ? "Updated!" : "Added!");
    qc.invalidateQueries({ queryKey: ["admin-stories"] });
    qc.invalidateQueries({ queryKey: ["stories"] });
    setDialog({ open: false, item: null });
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const { error } = await supabase.from("stories").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted.");
    qc.invalidateQueries({ queryKey: ["admin-stories"] });
    qc.invalidateQueries({ queryKey: ["stories"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">Stories</h2>
        <Button size="sm" onClick={openAdd}><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </div>

      {isLoading && <p className="mt-4 text-muted-foreground">Loading…</p>}

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4">
            <div>
              <p className="font-medium">{item.name}{item.age != null ? `, ${item.age}` : ""}</p>
              <p className="text-xs text-muted-foreground">{item.location ?? "No location"}</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(item.id, item.name)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialog.open} onOpenChange={(o) => !o && setDialog({ open: false, item: null })}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {dialog.item ? "Edit Story" : "Add Story"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Age (optional)</Label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
            </div>
            <div><Label>Location (optional)</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" /></div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <Label>Story</Label>
                <div className="flex items-center gap-1.5">
                  <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0 text-base font-bold"
                    onMouseDown={(e) => e.preventDefault()} onTouchStart={(e) => e.preventDefault()} onClick={() => wrapSelection("**")}>B</Button>
                  <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0 text-base underline"
                    onMouseDown={(e) => e.preventDefault()} onTouchStart={(e) => e.preventDefault()} onClick={() => wrapSelection("__")}>U</Button>
                </div>
              </div>
              <Textarea
                ref={storyRef}
                rows={5}
                value={form.story}
                onChange={(e) => setForm({ ...form, story: e.target.value })}
                onSelect={trackSelection}
                onKeyUp={trackSelection}
                onMouseUp={trackSelection}
                onTouchEnd={trackSelection}
                required
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Select text with your finger, then tap B / U to format (tap again on formatted text to undo it). Leave a blank line between paragraphs.
              </p>
              {form.story && (
                <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/40 p-4">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Preview</p>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{renderFormattedText(form.story)}</p>
                </div>
              )}
            </div>
            <MediaUpload label="Photo (optional)" value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              accept="image/*" placeholder="https://... or upload from laptop" />
            <MediaUpload label="Video (optional)" value={form.video_url}
              onChange={(url) => setForm({ ...form, video_url: url })}
              accept="video/*" placeholder="https://youtube.com/... or upload from laptop" />
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : dialog.item ? "Save changes" : "Add story"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out.");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Head>
          <title>Admin — Samaanya Foundation</title>
          <meta name="robots" content="noindex" />
        </Head>
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!session) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Admin — Samaanya Foundation</title>
        <meta name="robots" content="noindex" />
      </Head>
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="font-serif text-2xl">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="mr-1 h-4 w-4" /> Sign out
        </Button>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <Tabs defaultValue="fundraisers">
          <TabsList className="mb-8">
            <TabsTrigger value="fundraisers">Fundraisers</TabsTrigger>
            <TabsTrigger value="webinars">Webinars</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
          </TabsList>
          <TabsContent value="fundraisers"><FundraisersSection /></TabsContent>
          <TabsContent value="webinars"><WebinarsSection /></TabsContent>
          <TabsContent value="stories"><StoriesSection /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
