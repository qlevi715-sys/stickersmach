import { useRouter } from "expo-router";
import { useState } from "react";
import { AdminProfile, DrawerItemOption } from "../models/drawer.model";

export function useDrawer() {
  const router = useRouter();

  const [profile] = useState<AdminProfile>({
    name: "Admin User",
    role: "System managment",
    avatarUrl: "https://i.pinimg.com/originals/1b/bf/f2/1bbff28dac12b564b71a1326638c1d0d.jpg",
    version: "v4.4.4",
  });

  const navigationOptions: DrawerItemOption[] = [
    { name: "dashboard", label: "Dashboard", icon: "grid" },
    { name: "orders", label: "Orders", icon: "package" },
    {
      name: "inventory",
      label: "Inventory",
      icon: "archive",
      subitems: [
        {
          name: "inventory",
          label: "Categories",
          icon: "folder"
        },
        {
          name: "create-product",
          label: "Products",
          icon: "file-text"
        },
        {
          name: "create-service",
          label: "Servicios",
          icon: "service"
        }
      ]
    }
  ];

  return {
    profile,
    navigationOptions,
  };
}