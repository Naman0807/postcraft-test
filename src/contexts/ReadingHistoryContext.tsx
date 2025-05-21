import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAppContext } from "./AppContext";

interface ReadingHistoryItem {
	post_id: string;
	title: string;
	content: string;
	created_at: string;
	author_id: string;
	author_name: string | null;
}

interface ReadingHistoryContextType {
	readingHistory: ReadingHistoryItem[];
	addToReadingHistory: (postId: string) => Promise<void>;
	removeFromReadingHistory: (postId: string) => Promise<void>;
	clearReadingHistory: () => Promise<void>;
	isLoading: boolean;
}

const ReadingHistoryContext = createContext<
	ReadingHistoryContextType | undefined
>(undefined);

export function ReadingHistoryProvider({ children }: { children: ReactNode }) {
	const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useAppContext();

	useEffect(() => {
		if (user) {
			loadReadingHistory();
		} else {
			setReadingHistory([]);
			setIsLoading(false);
		}
	}, [user]);

	const loadReadingHistory = async () => {
		if (!user) return;

		try {
			setIsLoading(true);
			const { data, error } = await supabase.rpc("get_user_reading_history", {
				user_uuid: user.id,
			});

			if (error) {
				console.error("Error loading reading history:", error);
				toast.error("Failed to load reading history");
				return;
			}

			setReadingHistory(data || []);
		} catch (error) {
			console.error("Error in loadReadingHistory:", error);
			toast.error("An error occurred while loading reading history");
		} finally {
			setIsLoading(false);
		}
	};

	const addToReadingHistory = async (postId: string) => {
		if (!user) return;

		try {
			const { error } = await supabase
				.from("reading_history")
				.insert({
					user_id: user.id,
					post_id: postId,
				})
				.single();

			if (error) {
				if (error.code === "23505") {
					// Unique constraint violation
					// Post is already in reading history, silently ignore
					return;
				}
				console.error("Error adding to reading history:", error);
				toast.error("Failed to add to reading history");
				return;
			}

			// Reload reading history to get updated data with post details
			await loadReadingHistory();
		} catch (error) {
			console.error("Error in addToReadingHistory:", error);
			toast.error("An error occurred while adding to reading history");
		}
	};

	const removeFromReadingHistory = async (postId: string) => {
		if (!user) return;

		try {
			const { error } = await supabase.from("reading_history").delete().match({
				user_id: user.id,
				post_id: postId,
			});

			if (error) {
				console.error("Error removing from reading history:", error);
				toast.error("Failed to remove from reading history");
				return;
			}

			setReadingHistory((current) =>
				current.filter((item) => item.post_id !== postId)
			);
			toast.success("Removed from reading history");
		} catch (error) {
			console.error("Error in removeFromReadingHistory:", error);
			toast.error("An error occurred while removing from reading history");
		}
	};

	const clearReadingHistory = async () => {
		if (!user) return;

		try {
			const { error } = await supabase
				.from("reading_history")
				.delete()
				.match({ user_id: user.id });

			if (error) {
				console.error("Error clearing reading history:", error);
				toast.error("Failed to clear reading history");
				return;
			}

			setReadingHistory([]);
			toast.success("Reading history cleared");
		} catch (error) {
			console.error("Error in clearReadingHistory:", error);
			toast.error("An error occurred while clearing reading history");
		}
	};

	const value = {
		readingHistory,
		addToReadingHistory,
		removeFromReadingHistory,
		clearReadingHistory,
		isLoading,
	};

	return (
		<ReadingHistoryContext.Provider value={value}>
			{children}
		</ReadingHistoryContext.Provider>
	);
}

export function useReadingHistory() {
	const context = useContext(ReadingHistoryContext);
	if (context === undefined) {
		throw new Error(
			"useReadingHistory must be used within a ReadingHistoryProvider"
		);
	}
	return context;
}
