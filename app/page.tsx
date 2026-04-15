"use client";
import { useState } from "react";

export default function Page() {
  const [avis, setAvis] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [indicatif, setIndicatif] = useState("+237");
  const [type, setType] = useState("POSITIF");
  const [message, setMessage] = useState("");

  const emailValide = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const telephoneValide = (tel) => {
    return /^[0-9]{8,9}$/.test(tel); // 8 ou 9 chiffres
  };

  const envoyer = async () => {

    if (!emailValide(email)) {
      setMessage("Email invalide ❌");
      return;
    }

    if (!telephoneValide(telephone)) {
      setMessage("Numéro invalide ❌");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/sentiment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texte: avis,
            type: type,
            client: {
              email: email,
              telephone: indicatif + telephone,
            },
          }),
        }
      );

      if (response.ok) {
        if (type === "POSITIF") {
          setMessage("✅ Merci pour votre avis positif !");
        } else {
          setMessage("⚠️ Merci pour votre retour, nous allons nous améliorer.");
        }

        // Reset formulaire
        setAvis("");
        setEmail("");
        setTelephone("");
        setType("POSITIF");

        // Disparition après 3 secondes
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Erreur lors de l'envoi");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Erreur serveur");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Donnez votre avis
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-white text-center font-semibold ${
              message.includes("positif")
                ? "bg-green-500"
                : message.includes("négatif") || message.includes("invalide")
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col gap-4">

          <input
            value={avis}
            onChange={(e) => setAvis(e.target.value)}
            placeholder="Votre avis"
            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400"
          />

          {/* Téléphone avec indicatif */}
          <div className="flex gap-2">
            <select
              value={indicatif}
              onChange={(e) => setIndicatif(e.target.value)}
              className="p-3 rounded-lg border"
            >
              <option value="+237">🇨🇲 +237</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+1">🇺🇸 +1</option>
            </select>

            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="6XXXXXXXX"
              className="flex-1 p-3 rounded-lg border focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400"
          >
            <option value="POSITIF">Positif</option>
            <option value="NEGATIF">Négatif</option>
          </select>

          <button
            onClick={envoyer}
            className="bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Transmettre
          </button>
        </div>
      </div>
    </div>
  );
}