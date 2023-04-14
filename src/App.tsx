import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './layout'
import { Home } from './pages/home'
import { CreateUser } from './pages/createUser';
import { EditUser } from './pages/editUser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter([
  {
    path: "/",
    element: < Layout/>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/create",
        element: <CreateUser />,
      },
      {
        path:"/:id",
        element: <EditUser />
      }
    ]
  }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});



const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)

export default App