import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRouter";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ToastProvider } from "./components/Toast/ToastProvider";
import { HouseholdDetailRefreshProvider } from "./hooks/householdDetailRefreshContext.jsx";
import { GlobalSearchProvider } from "./hooks/globalSearchContext.jsx";
import { ConfirmProvider } from "./hooks/ConfirmContext.jsx";
const App = () => {
  return (
    <Provider store={store}>
      <ToastProvider>
        <ConfirmProvider>
          <HouseholdDetailRefreshProvider>
            <GlobalSearchProvider>
              <RouterProvider router={router} />
            </GlobalSearchProvider>
          </HouseholdDetailRefreshProvider>
        </ConfirmProvider>
      </ToastProvider>
    </Provider>
  );
};

export default App;
