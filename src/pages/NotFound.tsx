import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-display font-bold text-gradient mb-4">404</h1>
        <p className="text-lg text-foreground font-medium mb-2">Page not found</p>
        <p className="text-sm text-muted-foreground mb-8">
          The page <span className="font-mono text-primary">{location.pathname}</span> doesn't exist.
        </p>
        <Button asChild>
          <Link to="/" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;