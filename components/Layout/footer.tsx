export default function Footer() {
  return (
    <footer className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <h2 className="text-3xl font-bold mb-6">BELHOMZ.</h2>
          <p className="text-gray-400 max-w-sm">
            Crafting luxury experiences in Nigerian Real Estate. From initial consultation to final closing, we handle it all.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Locations</h4>
          <ul className="text-gray-400 space-y-2">
            <li>Abuja, FCT</li>
            <li>Lagos, Victoria Island</li>
            <li>Port Harcourt</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Connect</h4>
          <ul className="text-gray-400 space-y-2">
            <li>Instagram</li>
            <li>LinkedIn</li>
            <li>WhatsApp</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-20 pt-8 text-sm text-gray-500">
        © 2026 Belhomz Properties. All rights reserved.
      </div>
    </footer>
  );
}