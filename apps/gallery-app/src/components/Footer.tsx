export default function Footer() {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm">
          Made by{" "}
          <span className="text-white font-medium">Andrey</span>{" "}
          with{" "}
          <span className="text-red-500">❤️</span>
          {" • "}
          <a 
            href="https://github.com/AndreyPetkov03/gallery-app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline underline-offset-4"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}