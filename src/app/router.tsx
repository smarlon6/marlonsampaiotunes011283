import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { PetsPage } from "../features/pets/pages/PetsPage";
import { HealthPage } from "../pages/HealthPage";
import { PetDetailPage } from "../features/pets/pages/PetDetailPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <PetsPage /> },
      { path: "/health", element: <HealthPage /> },
      { path: "/pets/:id", element: <PetDetailPage /> },
    ],
  },
]);
