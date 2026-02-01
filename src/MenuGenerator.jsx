import { useState, useRef, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import logoImg from "../logo.png";

const STORAGE_KEY = "bistro-beni-saved-menus";
const DESIGN_STORAGE_KEY = "bistro-beni-design-settings";

const EXPORT_PRESETS = {
  original: {
    name: "Оригинален (1200 x auto)",
    width: 1200,
    height: null,
    scale: 2,
  },
  mobile: {
    name: "Мобилен (1080 x 1920)",
    width: 1080,
    height: 1920,
    scale: 2,
  },
  social: {
    name: "Социални мрежи (1080 x 1080)",
    width: 1080,
    height: 1080,
    scale: 2,
  },
  print: {
    name: "Печат A4 (2480 x 3508)",
    width: 2480,
    height: 3508,
    scale: 1,
  },
  wide: { name: "Широк (1920 x 1080)", width: 1920, height: 1080, scale: 2 },
};

const DEFAULT_SPACING = {
  contentPadding: 4,
  sectionGap: 2.5,
  itemGap: 0.8,
  fontScale: 1,
  subtitleScale: 1.5,
  logoScale: 1,
  bgOpacity: 0.55,
};

const DEFAULT_SECTIONS = [
  {
    title: "Супи",
    items: [
      { name: "Шкембе", priceBGN: "3.91", priceEUR: "2" },
      { name: "Пилешка", priceBGN: "3.91", priceEUR: "2" },
      { name: "Картофена", priceBGN: "3.91", priceEUR: "2" },
    ],
  },
  {
    title: "Ястия",
    items: [
      { name: "Мусака", priceBGN: "5.87", priceEUR: "3" },
      { name: "Пилешко бутче с ориз", priceBGN: "6.84", priceEUR: "3.5" },
      { name: 'Риба „Хек" с ориз', priceBGN: "7.82", priceEUR: "4" },
      { name: "Зеле със свинско на фурна", priceBGN: "6.84", priceEUR: "3.5" },
    ],
  },
  {
    title: "Десерти",
    items: [{ name: "Торта", priceBGN: "3.91", priceEUR: "2" }],
  },
];

const FOOTER_TEXT = 'Адрес: гр. Бяла, 7100 ул. "Минчо Папасчиков" Nº38';

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

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const MenuPreview = ({
  sections,
  backgroundImage,
  exportPreset,
  spacing,
  contentScale,
  verticalAlign,
  trimHeight,
  measuredContentHeight,
  showDate,
  menuDate,
}) => {
  const preset = EXPORT_PRESETS[exportPreset];
  const hasFixedHeight = preset.height !== null;

  const effectiveHeight = hasFixedHeight
    ? trimHeight
      ? Math.min(preset.height, measuredContentHeight + 48)
      : preset.height
    : "auto";

  const containerStyle = {
    width: preset.width,
    height: effectiveHeight,
    minHeight: hasFixedHeight ? undefined : "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent:
      hasFixedHeight && verticalAlign === "center" && !trimHeight
        ? "center"
        : "flex-start",
  };

  const contentStyle = {
    padding: `${spacing.contentPadding}rem ${spacing.contentPadding + 1}rem`,
    transform:
      hasFixedHeight && !trimHeight ? `scale(${contentScale})` : "none",
    transformOrigin:
      verticalAlign === "center" ? "center center" : "top center",
    fontSize: `${spacing.fontScale}rem`,
  };

  return (
    <div className="menu-container" style={containerStyle}>
      {backgroundImage && (
        <div
          className="menu-background"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            opacity: spacing.bgOpacity,
          }}
        />
      )}
      <div className="menu-content" style={contentStyle}>
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
          <div className="logo-container">
            <img
              src={logoImg}
              alt="Бистро Бени"
              className="restaurant-logo"
              style={{ width: `${spacing.logoScale * 400}px` }}
            />
          </div>
          <p
            className="subtitle"
            style={{ fontSize: `${spacing.subtitleScale * 2}em` }}
          >
            Обедно Меню
            {showDate && menuDate && (
              <span className="menu-date"> - {formatDate(menuDate)}</span>
            )}
          </p>
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

        <div
          className="menu-sections"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${spacing.sectionGap}rem`,
          }}
        >
          {sections.map(
            (section, sectionIdx) =>
              section.items.filter((i) => i.name).length > 0 && (
                <section key={sectionIdx} className="menu-section">
                  <h2 className="section-title">{section.title}</h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: `${spacing.itemGap}rem`,
                    }}
                  >
                    {section.items
                      .filter((i) => i.name)
                      .map((item, idx) => (
                        <div key={idx} className="menu-item">
                          <span className="item-name">{item.name}</span>
                          <span className="item-price">
                            {item.priceEUR && (
                              <span className="price-euro">
                                {item.priceEUR}€
                              </span>
                            )}
                            {item.priceEUR && item.priceBGN && " / "}
                            {item.priceBGN && (
                              <span className="price-bgn">
                                {item.priceBGN} лв
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                </section>
              ),
          )}
        </div>

        <footer
          className="menu-footer"
          style={{ marginTop: `${spacing.sectionGap}rem` }}
        >
          <p className="footer-text">{FOOTER_TEXT}</p>
          <p className="footer-text" style={{ marginTop: "0.75em" }}>
            Заповядайте!
          </p>
        </footer>
      </div>
    </div>
  );
};

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
          value={item.priceEUR}
          onChange={(e) => {
            const updated = [...items];
            updated[idx].priceEUR = e.target.value;
            setItems(updated);
          }}
          placeholder="€"
          className="w-16 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
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
        <button
          onClick={() => setItems(items.filter((_, i) => i !== idx))}
          className="w-8 h-8 bg-red-800 hover:bg-red-700 text-white rounded flex items-center justify-center text-sm"
        >
          X
        </button>
      </div>
    ))}
    <button
      onClick={() =>
        setItems([...items, { name: "", priceBGN: "", priceEUR: "" }])
      }
      className="w-full py-2 border border-dashed border-slate-600 hover:border-amber-500 text-slate-400 hover:text-amber-500 rounded text-sm transition-colors"
    >
      + Добави артикул
    </button>
  </div>
);

const SectionEditor = ({
  section,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onClearItems,
  isFirst,
  isLast,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasItems = section.items.some(
    (item) => item.name || item.priceBGN || item.priceEUR,
  );

  return (
    <div className="mb-3 bg-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-slate-600">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-300 hover:text-white w-5"
        >
          {isCollapsed ? ">" : "v"}
        </button>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          className="flex-1 px-2 py-1 bg-slate-800 border border-slate-500 rounded text-amber-400 font-semibold text-sm focus:border-amber-500 focus:outline-none"
          placeholder="Име на секция"
        />
        <div className="flex gap-1">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="w-7 h-7 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded flex items-center justify-center text-xs"
            title="Премести нагоре"
          >
            ^
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="w-7 h-7 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded flex items-center justify-center text-xs"
            title="Премести надолу"
          >
            v
          </button>
          <button
            onClick={onClearItems}
            disabled={!hasItems}
            className="w-7 h-7 bg-amber-700 hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded flex items-center justify-center text-xs"
            title="Изчисти артикулите"
          >
            C
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 bg-red-800 hover:bg-red-700 text-white rounded flex items-center justify-center text-xs"
            title="Изтрий секция"
          >
            X
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="p-4">
          <ItemEditor
            items={section.items}
            setItems={(items) => onUpdate({ ...section, items })}
            placeholder="Име на артикул"
          />
        </div>
      )}
    </div>
  );
};

const SpacingControl = ({ label, value, onChange, min, max, step }) => (
  <div className="flex items-center gap-3 py-1">
    <label className="text-xs text-slate-300 w-28 flex-shrink-0">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
    />
    <span className="text-xs text-slate-400 w-12 text-right flex-shrink-0">
      {value.toFixed(2)}
    </span>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 text-sm font-medium rounded-t transition-colors ${
      active
        ? "bg-slate-700 text-amber-400"
        : "bg-slate-800 text-slate-400 hover:text-slate-200"
    }`}
  >
    {children}
  </button>
);

export default function MenuGenerator() {
  const [activeTab, setActiveTab] = useState("menu");
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [exportPreset, setExportPreset] = useState("original");
  const [spacing, setSpacing] = useState(DEFAULT_SPACING);
  const [contentScale, setContentScale] = useState(1);
  const [autoFit, setAutoFit] = useState(true);
  const [verticalAlign, setVerticalAlign] = useState("top");
  const [trimHeight, setTrimHeight] = useState(false);
  const [measuredContentHeight, setMeasuredContentHeight] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [menuDate, setMenuDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [savedMenus, setSavedMenus] = useState([]);
  const [saveMenuName, setSaveMenuName] = useState("");

  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedMenus(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse saved menus", e);
    }

    try {
      const designStored = localStorage.getItem(DESIGN_STORAGE_KEY);
      if (designStored) {
        const parsed = JSON.parse(designStored);
        setSpacing({ ...DEFAULT_SPACING, ...parsed });
      }
    } catch (e) {
      console.error("Failed to parse design settings", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(spacing));
    } catch (e) {
      console.error("Failed to save design settings", e);
    }
  }, [spacing]);

  const saveMenu = () => {
    if (!saveMenuName.trim()) return;

    const menuData = {
      id: Date.now(),
      name: saveMenuName.trim(),
      sections: JSON.parse(JSON.stringify(sections)),
      spacing: { ...spacing },
      showDate,
      menuDate,
      savedAt: new Date().toISOString(),
    };

    const updated = [...savedMenus, menuData];
    setSavedMenus(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaveMenuName("");
  };

  const loadMenu = (menu) => {
    if (menu.sections && Array.isArray(menu.sections)) {
      setSections(JSON.parse(JSON.stringify(menu.sections)));
    }
    if (menu.spacing) {
      setSpacing({ ...DEFAULT_SPACING, ...menu.spacing });
    }
    if (typeof menu.showDate === "boolean") {
      setShowDate(menu.showDate);
    }
    if (menu.menuDate) {
      setMenuDate(menu.menuDate);
    }
  };

  const deleteMenu = (id) => {
    const updated = savedMenus.filter((m) => m.id !== id);
    setSavedMenus(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const calculateAutoFit = useCallback(() => {
    if (!menuRef.current) return;

    const preset = EXPORT_PRESETS[exportPreset];

    const content = menuRef.current.querySelector(".menu-content");
    if (!content) return;

    const tempScale = content.style.transform;
    content.style.transform = "none";

    const contentHeight = content.scrollHeight;
    setMeasuredContentHeight(contentHeight);

    content.style.transform = tempScale;

    if (!preset.height || trimHeight) {
      setContentScale(1);
      return;
    }

    const availableHeight = preset.height - 48;

    if (autoFit && contentHeight > availableHeight) {
      const newScale = Math.max(0.5, availableHeight / contentHeight);
      setContentScale(newScale);
    } else {
      setContentScale(1);
    }
  }, [exportPreset, autoFit, trimHeight]);

  useEffect(() => {
    const timer = setTimeout(calculateAutoFit, 100);
    return () => clearTimeout(timer);
  }, [calculateAutoFit, sections, spacing]);

  const handleBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "Нова секция",
        items: [{ name: "", priceBGN: "", priceEUR: "" }],
      },
    ]);
  };

  const updateSection = (index, updatedSection) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  };

  const deleteSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const clearSectionItems = (index) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      items: [{ name: "", priceBGN: "", priceEUR: "" }],
    };
    setSections(newSections);
  };

  const moveSection = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [
      newSections[newIndex],
      newSections[index],
    ];
    setSections(newSections);
  };

  const updateSpacing = (key, value) => {
    setSpacing((prev) => ({ ...prev, [key]: value }));
  };

  const resetSpacing = () => {
    setSpacing(DEFAULT_SPACING);
  };

  const handleDownload = async () => {
    if (!menuRef.current) return;

    setIsDownloading(true);
    const preset = EXPORT_PRESETS[exportPreset];

    try {
      const originalTransform = menuRef.current.style.transform;
      menuRef.current.style.transform = "none";

      const canvas = await html2canvas(menuRef.current, {
        scale: preset.scale,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      menuRef.current.style.transform = originalTransform;

      const link = document.createElement("a");
      link.download = `menu-${exportPreset}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Грешка при генериране на снимката.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getPreviewScale = () => {
    const preset = EXPORT_PRESETS[exportPreset];
    if (preset.width <= 1200) return 0.65;
    if (preset.width <= 1920) return 0.5;
    return 0.35;
  };

  const preset = EXPORT_PRESETS[exportPreset];
  const hasFixedHeight = preset.height !== null;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <style>{`
        .menu-export-wrapper {
          padding: 24px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 8px;
        }
        
        .menu-container {
          position: relative;
          background: linear-gradient(135deg, rgba(245,230,200,0.95) 0%, rgba(232,213,163,0.95) 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 
            0 0 0 12px #5c3a21,
            0 0 0 18px #c9a227,
            0 0 0 24px #3d2314,
            0 30px 60px rgba(0,0,0,0.5);
        }
        
        .menu-background {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
        }
        
        .menu-content {
          position: relative;
          z-index: 1;
        }
        
        .corner-ornament {
          position: absolute;
          width: 80px;
          height: 80px;
          opacity: 0.8;
          z-index: 2;
        }
        
        .corner-ornament.top-left { top: 15px; left: 15px; }
        .corner-ornament.top-right { top: 15px; right: 15px; transform: scaleX(-1); }
        .corner-ornament.bottom-left { bottom: 15px; left: 15px; transform: scaleY(-1); }
        .corner-ornament.bottom-right { bottom: 15px; right: 15px; transform: scale(-1, -1); }
        
        .menu-header {
          text-align: center;
          margin-bottom: 2em;
        }
        
        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1em;
        }
        
        .restaurant-logo {
          height: auto;
        }
        
        .subtitle {
          font-family: 'Cormorant Garamond', serif;
          color: #5c3a21;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .menu-date {
          display: block;
          font-size: 0.7em;
          letter-spacing: 0.2em;
          margin-top: 0.3em;
        }
        
        .menu-section {
        }
        
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5em;
          color: #722f37;
          text-align: center;
          margin-bottom: 0.5em;
          font-weight: 700;
        }
        
        .menu-item {
          font-family: 'Cormorant Garamond', serif;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-bottom: 2px dotted #e8d5a3;
          padding-bottom: 0.3em;
        }
        
        .menu-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .item-name {
          font-size: 2em;
          color: #2c1810;
          font-weight: 600;
        }
        
        .item-price {
          font-size: 2em;
          font-weight: 700;
          white-space: nowrap;
          margin-left: 1em;
          color: #722f37;
        }
        
        .price-euro {
          color: #722f37;
        }
        
        .price-bgn {
          color: #8b5e3c;
        }
        
        .menu-footer {
          text-align: center;
          padding-top: 1em;
          border-top: 3px solid #c9a227;
          font-weight: 600;
        }
        
        .footer-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75em;
          color: #5c3a21;
          font-style: italic;
        }
        
        .pattern {
          display: flex;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 1.5em;
        }
        
        .pattern-el {
          width: 14px;
          height: 14px;
          transform: rotate(45deg);
          opacity: 0.6;
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: #1e293b;
          border-radius: 4px;
          height: 6px;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid #1e293b;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid #1e293b;
        }
      `}</style>

      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-[520px] bg-slate-800 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-700 max-h-screen">
          <div className="p-4 pb-0">
            <h2 className="text-xl font-semibold mb-3 text-amber-500">
              Генератор на Меню
            </h2>
            <div className="flex gap-1 mb-0">
              <TabButton
                active={activeTab === "menu"}
                onClick={() => setActiveTab("menu")}
              >
                Меню
              </TabButton>
              <TabButton
                active={activeTab === "design"}
                onClick={() => setActiveTab("design")}
              >
                Дизайн
              </TabButton>
              <TabButton
                active={activeTab === "export"}
                onClick={() => setActiveTab("export")}
              >
                Експорт
              </TabButton>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-700 rounded-b-lg mx-4 mb-4">
            {activeTab === "menu" && (
              <div className="space-y-4">
                <div className="bg-slate-600 rounded-lg p-3">
                  <h3 className="text-sm font-semibold mb-2 text-amber-400">
                    Запазени менюта
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={saveMenuName}
                      onChange={(e) => setSaveMenuName(e.target.value)}
                      placeholder="Име на менюто"
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-500 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      onClick={saveMenu}
                      disabled={!saveMenuName.trim()}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 rounded text-sm font-medium transition-colors"
                    >
                      Запази
                    </button>
                  </div>
                  {savedMenus.length > 0 ? (
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {savedMenus.map((menu) => (
                        <div
                          key={menu.id}
                          className="flex items-center gap-2 text-sm bg-slate-700 rounded p-2"
                        >
                          <span className="flex-1 text-slate-300 truncate">
                            {menu.name}
                          </span>
                          <button
                            onClick={() => loadMenu(menu)}
                            className="px-2 py-1 bg-slate-500 hover:bg-slate-400 text-white rounded text-xs"
                          >
                            Зареди
                          </button>
                          <button
                            onClick={() => deleteMenu(menu.id)}
                            className="px-2 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-xs"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Няма запазени менюта
                    </p>
                  )}
                </div>

                <div className="bg-slate-600 rounded-lg p-3">
                  <h3 className="text-sm font-semibold mb-2 text-amber-400">
                    Дата на менюто
                  </h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="showDate"
                      checked={showDate}
                      onChange={(e) => setShowDate(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <label
                      htmlFor="showDate"
                      className="text-xs text-slate-300"
                    >
                      Покажи дата
                    </label>
                    {showDate && (
                      <input
                        type="date"
                        value={menuDate}
                        onChange={(e) => setMenuDate(e.target.value)}
                        className="flex-1 px-3 py-1 bg-slate-800 border border-slate-500 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-amber-400">
                      Секции
                    </h3>
                    <button
                      onClick={addSection}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-900 rounded text-sm font-medium transition-colors"
                    >
                      + Добави
                    </button>
                  </div>

                  {sections.map((section, index) => (
                    <SectionEditor
                      key={index}
                      section={section}
                      onUpdate={(updated) => updateSection(index, updated)}
                      onDelete={() => deleteSection(index)}
                      onMoveUp={() => moveSection(index, -1)}
                      onMoveDown={() => moveSection(index, 1)}
                      onClearItems={() => clearSectionItems(index)}
                      isFirst={index === 0}
                      isLast={index === sections.length - 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "design" && (
              <div className="space-y-4">
                <div className="bg-slate-600 rounded-lg p-3">
                  <h3 className="text-sm font-semibold mb-2 text-amber-400">
                    Фоново изображение
                  </h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 bg-slate-700 hover:bg-slate-500 text-white rounded text-sm transition-colors"
                    >
                      Избери изображение
                    </button>
                    {backgroundImage && (
                      <button
                        onClick={() => setBackgroundImage(null)}
                        className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded text-sm transition-colors"
                      >
                        Премахни
                      </button>
                    )}
                  </div>
                  {backgroundImage && (
                    <div className="mt-3">
                      <SpacingControl
                        label="Прозрачност"
                        value={spacing.bgOpacity}
                        onChange={(v) => updateSpacing("bgOpacity", v)}
                        min={0.1}
                        max={1}
                        step={0.05}
                      />
                    </div>
                  )}
                </div>

                <div className="bg-slate-600 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-amber-400">
                      Размери и разстояния
                    </h3>
                    <button
                      onClick={resetSpacing}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      По подразбиране
                    </button>
                  </div>
                  <div className="space-y-2">
                    <SpacingControl
                      label="Размер на лого"
                      value={spacing.logoScale}
                      onChange={(v) => updateSpacing("logoScale", v)}
                      min={0.3}
                      max={3}
                      step={0.05}
                    />
                    <SpacingControl
                      label="Подзаглавие"
                      value={spacing.subtitleScale}
                      onChange={(v) => updateSpacing("subtitleScale", v)}
                      min={0.5}
                      max={3}
                      step={0.1}
                    />
                    <SpacingControl
                      label="Размер на шрифт"
                      value={spacing.fontScale}
                      onChange={(v) => updateSpacing("fontScale", v)}
                      min={0.5}
                      max={2.5}
                      step={0.05}
                    />
                    <SpacingControl
                      label="Отстъп съдържание"
                      value={spacing.contentPadding}
                      onChange={(v) => updateSpacing("contentPadding", v)}
                      min={1}
                      max={12}
                      step={0.5}
                    />
                    <SpacingControl
                      label="Между секции"
                      value={spacing.sectionGap}
                      onChange={(v) => updateSpacing("sectionGap", v)}
                      min={0.5}
                      max={8}
                      step={0.25}
                    />
                    <SpacingControl
                      label="Между артикули"
                      value={spacing.itemGap}
                      onChange={(v) => updateSpacing("itemGap", v)}
                      min={0.2}
                      max={4}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "export" && (
              <div className="space-y-4">
                <div className="bg-slate-600 rounded-lg p-3">
                  <h3 className="text-sm font-semibold mb-2 text-amber-400">
                    Размер за експорт
                  </h3>
                  <select
                    value={exportPreset}
                    onChange={(e) => {
                      setExportPreset(e.target.value);
                      setTrimHeight(false);
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-500 rounded text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    {Object.entries(EXPORT_PRESETS).map(([key, preset]) => (
                      <option key={key} value={key}>
                        {preset.name}
                      </option>
                    ))}
                  </select>

                  {hasFixedHeight && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="trimHeight"
                          checked={trimHeight}
                          onChange={(e) => setTrimHeight(e.target.checked)}
                          className="accent-amber-500"
                        />
                        <label
                          htmlFor="trimHeight"
                          className="text-xs text-slate-300"
                        >
                          Премахни празното място отдолу
                        </label>
                      </div>

                      {!trimHeight && (
                        <>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="autoFit"
                              checked={autoFit}
                              onChange={(e) => setAutoFit(e.target.checked)}
                              className="accent-amber-500"
                            />
                            <label
                              htmlFor="autoFit"
                              className="text-xs text-slate-300"
                            >
                              Автоматично побиране в размера
                            </label>
                            {autoFit && contentScale < 1 && (
                              <span className="text-xs text-amber-400 ml-auto">
                                (мащаб: {(contentScale * 100).toFixed(0)}%)
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 pt-1">
                            <span className="text-xs text-slate-400">
                              Позиция:
                            </span>
                            <label className="flex items-center gap-1 text-xs text-slate-300">
                              <input
                                type="radio"
                                name="verticalAlign"
                                value="top"
                                checked={verticalAlign === "top"}
                                onChange={() => setVerticalAlign("top")}
                                className="accent-amber-500"
                              />
                              Горе
                            </label>
                            <label className="flex items-center gap-1 text-xs text-slate-300">
                              <input
                                type="radio"
                                name="verticalAlign"
                                value="center"
                                checked={verticalAlign === "center"}
                                onChange={() => setVerticalAlign("center")}
                                className="accent-amber-500"
                              />
                              Център
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed text-slate-900 font-semibold rounded transition-colors"
                >
                  {isDownloading ? "Генериране..." : "Изтегли като снимка"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-8 flex justify-center items-start overflow-auto bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex flex-col items-center gap-4">
            <span className="text-slate-500 text-sm">
              Преглед ({EXPORT_PRESETS[exportPreset].name})
            </span>
            <div
              ref={menuRef}
              className="menu-export-wrapper"
              style={{
                transform: `scale(${getPreviewScale()})`,
                transformOrigin: "top center",
              }}
            >
              <MenuPreview
                sections={sections}
                backgroundImage={backgroundImage}
                exportPreset={exportPreset}
                spacing={spacing}
                contentScale={contentScale}
                verticalAlign={verticalAlign}
                trimHeight={trimHeight}
                measuredContentHeight={measuredContentHeight}
                showDate={showDate}
                menuDate={menuDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
