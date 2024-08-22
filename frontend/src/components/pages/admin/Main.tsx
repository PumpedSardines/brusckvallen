import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import App from "./App";

const queryClient = new QueryClient();

function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export default React.memo(Main);
