import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Menu, X } from "lucide-react";

const Header = () => {
	const { remainingFreePosts, isSubscribed, user, signOut } = useAppContext();
	const navigate = useNavigate();
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);

	const handleSignOut = async () => {
		await signOut();
		navigate("/");
	};

	const isActive = (path: string) => location.pathname === path;

	const NavLink = ({
		to,
		children,
	}: {
		to: string;
		children: React.ReactNode;
	}) => (
		<Link
			to={to}
			className={`relative text-foreground font-medium transition-all duration-200 
				hover:text-primary group
				${isActive(to) ? "text-primary" : ""}
			`}
		>
			{children}
			<span
				className={`absolute left-0 bottom-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ease-out
				${isActive(to) ? "scale-x-100" : "scale-x-0"}
				group-hover:scale-x-100
			`}
			/>
		</Link>
	);

	const navigationLinks = [
		{ path: "/", label: "Home" },
		{ path: "/create", label: "Create Post" },
		{ path: "/settings", label: "Settings" },
	];

	return (
		<header className="sticky top-0 z-50 w-full py-4 px-4 md:px-8 border-b text-background bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<Link to="/" className="flex items-center space-x-2 z-10">
					<span className="text-2xl font-bold text-primary">PostCraft</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-8">
					{navigationLinks.map(({ path, label }) => (
						<NavLink key={path} to={path}>
							{label}
						</NavLink>
					))}
				</nav>

				{/* Mobile Navigation */}
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild className="md:hidden">
						<Button variant="ghost" size="icon" className="mr-2">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-[300px] sm:w-[400px]">
						<nav className="flex flex-col gap-6 mt-8">
							{navigationLinks.map(({ path, label }) => (
								<Link
									key={path}
									to={path}
									onClick={() => setIsOpen(false)}
									className={`text-lg font-medium transition-all duration-200 relative group flex items-center
										${
											isActive(path)
												? "text-primary translate-x-2"
												: "text-foreground hover:translate-x-2"
										}
									`}
								>
									{label}
									<span
										className={`absolute left-0 w-full h-0.5 bg-primary/20 -bottom-2 transform origin-left transition-all duration-300 ease-out
										${isActive(path) ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}
										group-hover:scale-x-100 group-hover:opacity-100
									`}
									/>
								</Link>
							))}
						</nav>
					</SheetContent>
				</Sheet>

				<div className="flex items-center space-x-4">
					{user ? (
						<>
							{!isSubscribed && (
								<div className="hidden md:block text-sm text-muted-foreground">
									<span className="font-medium">Free Posts: </span>
									<span className="font-bold">{remainingFreePosts}</span>
								</div>
							)}

							{!isSubscribed && (
								<Link to="/pricing">
									<Button
										variant="default"
										className="bg-primary hover:bg-accent"
									>
										Subscribe
									</Button>
								</Link>
							)}

							{isSubscribed && (
								<div className="hidden md:flex items-center">
									<span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
										Premium
									</span>
								</div>
							)}

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="rounded-full">
										<User className="h-5 w-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => navigate("/settings")}>
										<Settings className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleSignOut}>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Sign out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<Link to="/auth">
							<Button variant="default" className="bg-primary hover:bg-accent">
								Sign In
							</Button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
