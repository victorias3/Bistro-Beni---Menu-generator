import { useState, useRef } from "react";
import html2canvas from "html2canvas";

const CornerOrnament = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 10 Q50 10 50 50 Q50 10 90 10"
      stroke="#c9a227"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M10 10 Q10 50 50 50 Q10 50 10 90"
      stroke="#c9a227"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="50" cy="50" r="8" fill="#722f37" />
    <circle cx="50" cy="50" r="4" fill="#c9a227" />
    <path d="M30 30 L35 25 L40 30 L35 35 Z" fill="#c9a227" />
  </svg>
);

const MenuPreview = ({ name, soups, dishes, desserts }) => (
  <div className="menu-container">
    <div className="corner-ornament top-left">
      <CornerOrnament />
    </div>
    <div className="corner-ornament top-right">
      <CornerOrnament />
    </div>
    <div className="corner-ornament bottom-left">
      <CornerOrnament />
    </div>
    <div className="corner-ornament bottom-right">
      <CornerOrnament />
    </div>

    <header className="menu-header">
      <h1 className="restaurant-name">
        Бистро Бени
      </h1>

      <p className="subtitle">Обедно Меню</p>
      <div className="pattern">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="pattern-el"
            style={{ background: i % 2 === 0 ? "#722f37" : "#c9a227" }}
          />
        ))}
      </div>
    </header>

    {soups.filter((i) => i.name).length > 0 && (
      <section className="menu-section">
        <h2 className="section-title">Супи</h2>
        {soups
          .filter((i) => i.name)
          .map((item, idx) => (
            <div key={idx} className="menu-item">
              <span className="item-name">{item.name}</span>
              <span className="item-price">
                {item.priceBGN && `${item.priceBGN} лв`}
                {item.priceEUR && (
                  <span className="price-euro">/  {item.priceEUR}€</span>
                )}
              </span>
            </div>
          ))}
      </section>
    )}

    {dishes.filter((i) => i.name).length > 0 && (
      <section className="menu-section">
        <h2 className="section-title">Ястия</h2>
        {dishes
          .filter((i) => i.name)
          .map((item, idx) => (
            <div key={idx} className="menu-item">
              <span className="item-name">{item.name}</span>
              <span className="item-price">
                {item.priceBGN && `${item.priceBGN} лв`}
                {item.priceEUR && (
                  <span className="price-euro">/  {item.priceEUR}€</span>
                )}
              </span>
            </div>
          ))}
      </section>
    )}

    {desserts.filter((i) => i.name).length > 0 && (
      <section className="menu-section">
        <h2 className="section-title">Десерти</h2>
        {desserts
          .filter((i) => i.name)
          .map((item, idx) => (
            <div key={idx} className="menu-item">
              <span className="item-name">{item.name}</span>
              <span className="item-price">
                {item.priceBGN && `${item.priceBGN} лв`}
                {item.priceEUR && (
                  <span className="price-euro">/  {item.priceEUR}€</span>
                )}
              </span>
            </div>
          ))}
      </section>
    )}
    <footer className="menu-footer">
      <p className="footer-text">Адрес: ул. "Минчо Папасчиков" Nº38</p>
      <p
        className="footer-text"
        style={{ marginTop: "0.75rem", fontSize: "1.75rem" }}
      >
        Заповядайте!
      </p>
    </footer>
  </div>
);

const ItemEditor = ({ items, setItems, placeholder }) => (
  <div className="flex flex-col gap-2">
    {items.map((item, idx) => (
      <div key={idx} className="flex gap-2 items-center">
        <input
          type="text"
          value={item.name}
          onChange={(e) => {
            const updated = [...items];
            updated[idx].name = e.target.value;
            setItems(updated);
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
        />
        <input
          type="text"
          value={item.priceBGN}
          onChange={(e) => {
            const updated = [...items];
            updated[idx].priceBGN = e.target.value;
            setItems(updated);
          }}
          placeholder="лв"
          className="w-20 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
        />
        <input
          type="text"
          value={item.priceEUR}
          onChange={(e) => {
            const updated = [...items];
            updated[idx].priceEUR = e.target.value;
            setItems(updated);
          }}
          placeholder="€"
          className="w-16 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
        />
        <button
          onClick={() => setItems(items.filter((_, i) => i !== idx))}
          className="w-8 h-8 bg-red-800 hover:bg-red-700 text-white rounded flex items-center justify-center text-sm"
        >
          ✕
        </button>
      </div>
    ))}
    <button
      onClick={() =>
        setItems([...items, { name: "", priceBGN: "", priceEUR: "" }])
      }
      className="w-full py-2 border border-dashed border-slate-600 hover:border-amber-500 text-slate-400 hover:text-amber-500 rounded text-sm transition-colors"
    >
      + Добави
    </button>
  </div>
);

export default function MenuGenerator() {
  const [name, setName] = useState("Бистро Бени");
  const [soups, setSoups] = useState([
    { name: "Шкембе", priceBGN: "3.91", priceEUR: "2" },
    { name: "Пилешка", priceBGN: "3.91", priceEUR: "2" },
    { name: "Картофена", priceBGN: "3.91", priceEUR: "2" },
  ]);
  const [dishes, setDishes] = useState([
    { name: "Мусака", priceBGN: "5.87", priceEUR: "3" },
    { name: "Пилешко бутче с ориз", priceBGN: "6.84", priceEUR: "3.5" },
    { name: 'Риба „Хек" с ориз', priceBGN: "7.82", priceEUR: "4" },
    { name: "Зеле със свинско на фурна", priceBGN: "6.84", priceEUR: "3.5" },
  ]);
  const [desserts, setDesserts] = useState([
    { name: "Торта", priceBGN: "3.91", priceEUR: "2" },
  ]);
  const [isDownloading, setIsDownloading] = useState(false);

  const menuRef = useRef(null);

  const handleDownload = async () => {
    if (!menuRef.current) return;

    setIsDownloading(true);

    try {
      // Temporarily remove scale for capture
      const originalTransform = menuRef.current.style.transform;
      menuRef.current.style.transform = "none";

      const canvas = await html2canvas(menuRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      // Restore scale
      menuRef.current.style.transform = originalTransform;

      const link = document.createElement("a");
      link.download = `menu-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Грешка при генериране на снимката.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <style>{`
        .menu-export-wrapper {
          padding: 40px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 8px;
        }
        
        .menu-container {
          width: 1200px;
          background: linear-gradient(135deg, rgba(245,230,200,0.95) 0%, rgba(232,213,163,0.95) 100%);
          border-radius: 12px;
          padding: 4rem 5rem;
          position: relative;
          box-shadow: 
            0 0 0 12px #5c3a21,
            0 0 0 18px #c9a227,
            0 0 0 24px #3d2314,
            0 30px 60px rgba(0,0,0,0.5);
        }
        
        .corner-ornament {
          position: absolute;
          width: 100px;
          height: 100px;
          opacity: 0.8;
        }
        
        .corner-ornament.top-left { top: 20px; left: 20px; }
        .corner-ornament.top-right { top: 20px; right: 20px; transform: scaleX(-1); }
        .corner-ornament.bottom-left { bottom: 20px; left: 20px; transform: scaleY(-1); }
        .corner-ornament.bottom-right { bottom: 20px; right: 20px; transform: scale(-1, -1); }
        
        .menu-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .restaurant-name {
          font-family: 'Marck Script', cursive;
          font-size: 5rem;
          color: #4a1c24;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.1);
          margin-bottom: 3rem;
          line-height: 1.1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #5c3a21;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2rem;
          gap: 1.2rem;
        }
        
        .divider-line {
          height: 3px;
          width: 150px;
          background: linear-gradient(90deg, transparent, #c9a227, transparent);
        }
        
        .divider-icon {
          color: #c9a227;
          font-size: 2rem;
        }
        
        .menu-section {
          margin-bottom: 2.5rem;
        }
        
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          color: #722f37;
          text-align: center;
          margin-bottom: 1.2rem;
          font-weight: 700;
        }
        
        .menu-item {
          font-family: 'Cormorant Garamond', serif;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 0.8rem 0;
          border-bottom: 2px dotted #e8d5a3;
        }
        
        .menu-item:last-child {
          border-bottom: none;
        }
        
        .item-name {
          font-size: 2rem;
          color: #2c1810;
          font-weight: 600;
        }
        
        .item-price {
          font-size: 2rem;
          color: #722f37;
          font-weight: 700;
          white-space: nowrap;
          margin-left: 2rem;
        }
        
        .price-euro {
          color: #8b5e3c;
          font-size: 2rem;
          margin-left: 0.6rem;
        }
        
        .menu-footer {
          text-align: center;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 3px solid #c9a227;
        }
        
        .footer-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #5c3a21;
          font-style: italic;
        }
        
        .pattern {
          display: flex;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 2rem;
        }
        
        .pattern-el {
          width: 16px;
          height: 16px;
          transform: rotate(45deg);
          opacity: 0.6;
        }
      `}</style>

      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-[560px] bg-slate-800 p-4 lg:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-amber-500">
            Генератор на Меню
          </h2>

          <div className="mb-4">
            <label className="text-sm text-slate-400 mb-1 block">
              Име на заведението
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="mb-4 bg-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-amber-400">Супи</h3>
            <ItemEditor
              items={soups}
              setItems={setSoups}
              placeholder="Име на супа"
            />
          </div>

          <div className="mb-4 bg-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-amber-400">Ястия</h3>
            <ItemEditor
              items={dishes}
              setItems={setDishes}
              placeholder="Име на ястие"
            />
          </div>

          <div className="mb-4 bg-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-amber-400">
              Десерти
            </h3>
            <ItemEditor
              items={desserts}
              setItems={setDesserts}
              placeholder="Име на десерт"
            />
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed text-slate-900 font-semibold rounded transition-colors"
          >
            {isDownloading ? "⏳ Генериране..." : "📥 Изтегли като снимка"}
          </button>
        </div>

        <div className="flex-1 p-4 lg:p-8 flex justify-center items-start overflow-auto bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex flex-col items-center gap-4">
            <span className="text-slate-500 text-sm">
              Преглед на менюто (мащабиран)
            </span>
            <div
              ref={menuRef}
              className="menu-export-wrapper"
              style={{
                transform: "scale(0.55)",
                transformOrigin: "top center",
              }}
            >
              <MenuPreview
                name={name}
                soups={soups}
                dishes={dishes}
                desserts={desserts}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
