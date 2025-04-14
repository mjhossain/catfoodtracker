import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.jsx";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { useEffect } from "react";
import { initializeDatabase } from "@/lib/supabase";
import RefreshButton from "@/components/RefreshButton";

function Header() {
  // Access the queryClient to refresh all queries
  const refreshData = async () => {
    await queryClient.refetchQueries();
    console.log("All data refreshed");
  };
  
  return (
    <header className="sticky top-0 bg-white z-10 shadow-sm py-2 px-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Cat Feed Tracker</h1>
      <RefreshButton onRefresh={refreshData} label="Refresh Data" />
    </header>
  );
}

function Router() {
  return (
    <>
      <Header />
      <main className="p-4">
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  // Initialize Supabase database when the application starts
  useEffect(() => {
    console.log("Initializing Supabase database...");
    initializeDatabase()
      .then(() => {
        console.log("Database initialization complete");
      })
      .catch(error => {
        console.error("Failed to initialize database:", error);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;