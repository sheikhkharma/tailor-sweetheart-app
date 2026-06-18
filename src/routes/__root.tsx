import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AtelierNav } from "@/components/AtelierNav";
import { CommandesProvider } from "@/lib/commandes-store";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-mono font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Omar Waly Fashion — Gestion d'Atelier" },
      { name: "description", content: "Application de gestion d'atelier de couture — mesures, clients et commandes." },
      { property: "og:title", content: "Omar Waly Fashion — Gestion d'Atelier" },
      { property: "og:description", content: "Application de gestion d'atelier de couture — mesures, clients et commandes." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Omar Waly Fashion — Gestion d'Atelier" },
      { name: "twitter:description", content: "Application de gestion d'atelier de couture — mesures, clients et commandes." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/74a6a2bd-d114-4aff-b143-1bc268c76bba/id-preview-59008f2b--4d93c22a-6a73-4388-9d5a-3b29263d2440.lovable.app-1777933704302.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/74a6a2bd-d114-4aff-b143-1bc268c76bba/id-preview-59008f2b--4d93c22a-6a73-4388-9d5a-3b29263d2440.lovable.app-1777933704302.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <CommandesProvider>
        <AppShell />
      </CommandesProvider>
    </AuthProvider>
  );
}

function AppShell() {
  const { user, loading, firestoreError } = useAuth();

  if (firestoreError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          </div>
          <h1 className="text-xl font-bold text-foreground">Problème de connexion</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{firestoreError}</p>
          <div className="pt-2">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="size-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Chargement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {user && <AtelierNav />}
      <main>
        <Outlet />
      </main>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] text-foreground bg-dot-grid" />
    </div>
  );
}
