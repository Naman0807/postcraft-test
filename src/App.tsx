import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
} from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import CreatePostPage from "@/pages/CreatePostPage";
import SettingsPage from "@/pages/SettingsPage";
import PricingPage from "@/pages/PricingPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import HelpPage from "@/pages/HelpPage";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<AppProvider>
			<TooltipProvider>
				<Toaster />
				<BrowserRouter>
					<Routes>
						<Route path="/auth" element={<AuthPage />} />
						<Route
							path="/"
							element={
								<Layout>
									<Outlet />
								</Layout>
							}
						>
							<Route index element={<HomePage />} />
							<Route
								path="create"
								element={
									<ProtectedRoute>
										<CreatePostPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="settings"
								element={
									<ProtectedRoute>
										<SettingsPage />
									</ProtectedRoute>
								}
							/>
							<Route path="pricing" element={<PricingPage />} />
							<Route path="payment-success" element={<PaymentSuccessPage />} />
							<Route path="help" element={<HelpPage />} />
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</TooltipProvider>
		</AppProvider>
	</QueryClientProvider>
);

export default App;
