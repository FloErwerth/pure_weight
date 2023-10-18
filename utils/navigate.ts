import { router } from "expo-router";
import { useCallback } from "react";
import { Routes } from "../types/routes";

export const useNavigate = () =>
  useCallback((route: Routes) => {
    router.push(route);
  }, []);
