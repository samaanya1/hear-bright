import type { RouteRecord } from "vite-react-ssg";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Understanding from "./pages/Understanding.tsx";
import CochlearImplants from "./pages/CochlearImplants.tsx";
import Programs from "./pages/Programs.tsx";
import Fundraisers, { loader as fundraisersLoader } from "./pages/Fundraisers.tsx";
import Donate from "./pages/Donate.tsx";
import Contact from "./pages/Contact.tsx";
import Webinars, { loader as webinarsLoader } from "./pages/Webinars.tsx";
import Stories, { loader as storiesLoader } from "./pages/Stories.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const Providers = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Outlet />
    </TooltipProvider>
  </QueryClientProvider>
);

const PublicLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Providers />,
    children: [
      // Admin — no navbar/footer
      { path: "admin", element: <Admin /> },

      // Public site — wrapped in Layout
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "about", element: <About /> },
          { path: "understanding", element: <Understanding /> },
          { path: "cochlear-implants", element: <CochlearImplants /> },
          { path: "programs", element: <Programs /> },
          { path: "workshops", element: <Programs /> },
          { path: "webinars", element: <Webinars />, loader: webinarsLoader },
          { path: "stories", element: <Stories />, loader: storiesLoader },
          { path: "fundraisers", element: <Fundraisers />, loader: fundraisersLoader },
          { path: "donate", element: <Donate /> },
          { path: "contact", element: <Contact /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
];
