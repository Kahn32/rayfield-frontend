import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-foreground">
            Rayfield Energy AI
          </h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <Button variant="nav" size="nav">
            Features
          </Button>
          <Button variant="nav" size="nav">
            Upload
          </Button>
          <Button variant="default" size="default">
            Dashboard
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;