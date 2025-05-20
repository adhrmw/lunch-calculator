export function Footer() {
    return (
      <footer className="border-t mt-8 py-4">
        <div className="container flex justify-between items-center text-center text-sm text-muted-foreground space-y-1">
          <p>© {new Date().getFullYear()} Lunch Calculator — Jangan Lupa Bayar!</p>
          <p>Made by Ananda Wijaya</p>
        </div>
      </footer>
    );
  }
  