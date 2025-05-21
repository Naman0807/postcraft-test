import { useReadingHistory } from "@/contexts/ReadingHistoryContext";
import { Button } from "@/components/ui/button";
import { Trash2, History, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const ReadingHistoryPage = () => {
	const { readingHistory, clearReadingHistory, isLoading } =
		useReadingHistory();

	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<div className="flex items-center space-x-2 mb-6">
					<History className="w-6 h-6" />
					<h1 className="text-2xl font-bold">Reading History</h1>
				</div>
				<div className="animate-pulse space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-32 bg-muted rounded-lg" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center space-x-2">
					<History className="w-6 h-6" />
					<h1 className="text-2xl font-bold">Reading History</h1>
				</div>
			</div>

			{readingHistory.length === 0 ? (
				<div className="text-center py-12">
					<Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-medium text-muted-foreground">
						No reading history yet
					</h3>
					<p className="text-sm text-muted-foreground mt-2">
						Posts you view will appear here
					</p>
				</div>
			) : (
				<div className="grid gap-4">
					{readingHistory.map((item) => (
						<Link key={item.post_id} to={`/post/${item.post_id}`}>
							<Card className="p-4 hover:shadow-md transition-shadow">
								<h2 className="text-xl font-semibold mb-2">{item.title}</h2>
								<p className="text-muted-foreground line-clamp-2">
									{item.content}
								</p>
								<div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
									{item.author_name && (
										<span className="font-medium">{item.author_name}</span>
									)}
									<time dateTime={item.created_at}>
										{new Date(item.created_at).toLocaleDateString()}
									</time>
								</div>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default ReadingHistoryPage;
