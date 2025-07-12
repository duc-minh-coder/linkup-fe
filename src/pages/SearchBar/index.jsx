// src/components/SearchBar.jsx
import "./SearchBar.scss";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchBar({ isOpen, onClose }) {
    const inputRef = useRef();
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debounceText = useDebounce(text, 300);

    const API_BASE_URL = "http://localhost:8080";

    const handlingChangeText = (e) => {
        setText(e.target.value);
    }

    useEffect(() => {
        if (isOpen) 
            inputRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        if (debounceText?.trim()) {
            setLoading(true);
            console.log("debounceText:", debounceText);

            try {
                const token = localStorage.getItem("token");

                axios.post(`${API_BASE_URL}/api/profiles/search`, {
                    text: debounceText
                }, {
                    headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                    }
                }).then ((response) => {
                    console.log(response.data.result);
                    
                    setResults(response.data.result)
                }).catch((err) => {
                    console.log(err);
                    setResults([]);
                }).finally(() => {
                    setLoading(false);
                })

            }
            catch(err) {
                console.log(err);
            }
        }
    }, [debounceText])

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
                        onChange={handlingChangeText}
                        value={text}
                    />
                </div>

                <div className="search-sidebar__results">
                    {loading ? (
                        <p>Đang tìm kiếm...</p>
                    ) : 
                    results.length > 0 ? (
                        results.map((user) => (
                            <div 
                                key={user.id} 
                                className="search-sidebar__item" 
                                onClick={() => {
                                    navigate(`/profile/${user.id}`)
                                }}
                            >
                                <img
                                    src={user.avatarUrl}
                                    alt={user.fullName}
                                    width="40"
                                    height="40"
                                    className="search-sidebar__avatar"
                                />
                                <div className="search-sidebar__info">
                                    <p className="search-sidebar__fullname">{user.fullName}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="search-sidebar__no-result">Không có dữ liệu tìm kiếm</p>
                    )}
                </div>
            </div>
            
            <div className="search-overlay" onClick={onClose}></div>
        </div>
    );
}

export default SearchBar;
