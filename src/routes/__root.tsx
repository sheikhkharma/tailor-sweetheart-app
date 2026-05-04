import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AtelierNav } from "@/components/AtelierNav";
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <AtelierNav />
      <main>
        <Outlet />
      </main>
      {/* Subtle dot grid texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] text-foreground bg-dot-grid" />
    </div>
  );
}
