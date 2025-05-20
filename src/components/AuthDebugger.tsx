import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const AuthDebugger = () => {
	const [session, setSession] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [profile, setProfile] = useState<any>(null);

	useEffect(() => {
		// Check session on load
		checkSession();

		// Listen for auth changes
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				console.log("Auth state changed:", event);
				setSession(session);
				if (session?.user) {
					checkProfile(session.user.id);
				}
			}
		);

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

	const checkSession = async () => {
		try {
			const { data, error } = await supabase.auth.getSession();
			if (error) {
				setError(error.message);
			} else {
				setSession(data.session);
				if (data.session?.user) {
					checkProfile(data.session.user.id);
				}
			}
		} catch (e: any) {
			setError(e.message);
		}
	};

	const checkProfile = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) {
				console.error("Profile fetch error:", error);
			} else {
				setProfile(data);
			}
		} catch (e: any) {
			console.error("Profile check error:", e);
		}
	};

	// Only render in development mode
	if (process.env.NODE_ENV !== "development") {
		return null;
	}

	return (
		<div
			style={{
				position: "fixed",
				bottom: 0,
				right: 0,
				zIndex: 9999,
				background: "#f0f0f0",
				padding: "10px",
				maxWidth: "300px",
				fontSize: "12px",
				opacity: 0.8,
			}}
		>
			<h4>Auth Debugger</h4>
			{error && <div style={{ color: "red" }}>Error: {error}</div>}
			<div>
				Session: {session ? "Active" : "None"}
				{session && <span> - {session.user.email}</span>}
			</div>
			{profile && (
				<div>
					Profile: Found (Posts: {profile.remaining_free_posts}, Subscribed:{" "}
					{profile.is_subscribed ? "Yes" : "No"})
				</div>
			)}
		</div>
	);
};

export default AuthDebugger;
