import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import FeedingControls from "@/components/FeedingControls";
import FeedingStatus from "@/components/FeedingStatus";
import FeedingHistory from "@/components/FeedingHistory";
import { queryClient } from "@/lib/queryClient";
import { getLastFeeding, getRecentFeedings, createFeeding } from "@/lib/supabase";
import RefreshButton from "@/components/RefreshButton";

export default function Home() {
  const { toast } = useToast();

  // Fetch last feeding using Supabase
  const lastFeedingQuery = useQuery({
    queryKey: ["feedings/last"],
    queryFn: () => getLastFeeding(),
  });

  // Fetch recent feedings using Supabase (limit of 5)
  const feedingHistoryQuery = useQuery({
    queryKey: ["feedings/recent"],
    queryFn: () => getRecentFeedings(5),
  });

  // Create feeding mutation using Supabase
  const createFeedingMutation = useMutation({
    mutationFn: async (color) => {
      return createFeeding(color);
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["feedings/last"] });
      queryClient.invalidateQueries({ queryKey: ["feedings/recent"] });
      toast({
        title: "Feeding recorded!",
        description: "The feeding has been successfully recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record feeding: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmitFeeding = (color) => {
    createFeedingMutation.mutate(color);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AppHeader />
      
      <main className="flex-1 p-4 md:p-6 flex flex-col md:flex-row gap-6 overflow-hidden">
        <div className="flex-1 md:w-1/2 flex">
          <FeedingControls
            onSubmit={handleSubmitFeeding}
            isPending={createFeedingMutation.isPending}
          />
        </div>
        
        <div className="flex-1 md:w-1/2 flex">
          <FeedingStatus
            lastFeeding={lastFeedingQuery.data}
            feedingHistory={feedingHistoryQuery.data || []}
            isLoading={lastFeedingQuery.isLoading || feedingHistoryQuery.isLoading}
          />
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
}