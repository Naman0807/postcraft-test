import React, { ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

interface ProtectedRouteProps {
	children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { session } = useAppContext();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		// Add a small delay to ensure authentication state is stable
		const timer = setTimeout(() => {
			setIsChecking(false);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	if (isChecking) {
		return (
			<div className="min-h-[calc(100vh-144px)] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4">Checking authorization...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return <Navigate to="/auth" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
