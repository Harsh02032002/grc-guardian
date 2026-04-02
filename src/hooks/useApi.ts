import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetApi, riskApi, controlApi, treatmentApi, configApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";

// ========== ASSETS ==========
export function useAssets() {
  return useQuery({ queryKey: ["assets"], queryFn: assetApi.getAll });
}

export function useCreateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assetApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets"] });
      toast({ title: "Asset created successfully" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

export function useDeleteAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assetApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets"] });
      toast({ title: "Asset deleted" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

// ========== RISKS ==========
export function useRisks() {
  return useQuery({ queryKey: ["risks"], queryFn: riskApi.getAll });
}

export function useCreateRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: riskApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["risks"] });
      toast({ title: "Risk created successfully" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

export function useDeleteRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: riskApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["risks"] });
      toast({ title: "Risk deleted" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

// ========== CONTROLS ==========
export function useControls() {
  return useQuery({ queryKey: ["controls"], queryFn: controlApi.getAll });
}

export function useCreateControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: controlApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["controls"] });
      toast({ title: "Control created successfully" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

export function useDeleteControl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: controlApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["controls"] });
      toast({ title: "Control deleted" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

// ========== TREATMENTS ==========
export function useTreatments() {
  return useQuery({ queryKey: ["treatments"], queryFn: treatmentApi.getAll });
}

export function useCreateTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: treatmentApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["treatments"] });
      toast({ title: "Treatment created successfully" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

export function useDeleteTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: treatmentApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["treatments"] });
      toast({ title: "Treatment deleted" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

// ========== CONFIG ==========
export function useConfig(type: string) {
  return useQuery({
    queryKey: ["config", type],
    queryFn: () => configApi.getByType(type),
    enabled: !!type,
  });
}

export function useCreateConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: configApi.create,
    onSuccess: (_, variables: any) => {
      qc.invalidateQueries({ queryKey: ["config", variables.type] });
      toast({ title: "Config saved" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

export function useDeleteConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: configApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["config"] });
      toast({ title: "Config deleted" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}
