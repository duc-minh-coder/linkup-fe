// src/components/SearchBar.jsx
import "./SearchBar.scss";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

function SearchBar({ isOpen, onClose }) {
  const inputRef = useRef();

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="search-container">
        <div className="search-sidebar">
            <div className="search-sidebar__header">
                <h3 className="search-sidebar__title">Tìm kiếm</h3>
                <X className="search-sidebar__close" onClick={onClose} size={20} />
                </div>
                <div className="search-sidebar__input-wrapper">
                <input
                    ref={inputRef}
                    type="text"
                    className="search-sidebar__input"
                    placeholder="Tìm kiếm người dùng..."
                />
            </div>
            
            <div className="search-sidebar__results">
                <p className="search-sidebar__no-result">Không có dữ liệu tìm kiếm</p>
            </div>
        </div>
        <div className="search-overlay" onClick={onClose}></div>
    </div>
  );
}

export default SearchBar;
