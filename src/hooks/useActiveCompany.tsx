import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type Company = {
  id: string;
  name: string;
  country: string;
  industry: string | null;
  business_type: string | null;
  registration_no: string | null;
  tax_id: string | null;
  owner_id: string;
};

export function useCompanies() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["companies", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Company[]> => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Company[];
    },
  });
}

export function useActiveCompany() {
  const { data: companies, isLoading } = useCompanies();
  const active = companies?.[0] ?? null;
  return { company: active, companies: companies ?? [], isLoading };
}
