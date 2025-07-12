import "./About.scss";

function About() {
    return (
        <div className="About-container">
            <div className="introduce">
                <h2>Giới thiệu về LinkUp</h2>
                <p>
                    <strong>LinkUp</strong> là nền tảng mạng xã hội giúp bạn kết nối, chia sẻ và phát triển mạng lưới cá nhân cũng như chuyên nghiệp. 
                    Với sự kết hợp của các tính năng từ Facebook, Instagram và LinkedIn, LinkUp là nơi bạn có thể vừa trò chuyện với bạn bè, chia sẻ khoảnh khắc cuộc sống, vừa thể hiện kỹ năng và xây dựng thương hiệu cá nhân.
                </p>
            </div>

            <div className="help">
                <h2>Trợ giúp</h2>
                <p>
                    Gặp sự cố khi sử dụng? Truy cập <a href="#">Trung tâm trợ giúp</a> để tìm câu trả lời nhanh chóng hoặc liên hệ với đội ngũ hỗ trợ của LinkUp.
                </p>
            </div>

            <div className="api">
                <h2>API & Nhà phát triển</h2>
                <p>
                    LinkUp cung cấp API mở để hỗ trợ các nhà phát triển tích hợp hoặc xây dựng các ứng dụng mở rộng. 
                    Tìm hiểu thêm tại <a href="#">Tài liệu dành cho nhà phát triển</a>.
                </p>
            </div>

            <div className="privacy">
                <h2>Chính sách quyền riêng tư</h2>
                <p>
                    Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn. 
                    Vui lòng đọc <a href="#">Chính sách quyền riêng tư</a> để hiểu cách chúng tôi thu thập và sử dụng thông tin.
                </p>
            </div>

            <div className="clause">
                <h2>Điều khoản sử dụng</h2>
                <p>
                    Khi sử dụng LinkUp, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>. 
                    Chúng tôi khuyến khích bạn đọc kỹ để hiểu quyền và trách nhiệm của mình.
                </p>
            </div>

            <div className="language">
                <span>Ngôn ngữ: Tiếng Việt</span>
            </div>

            <footer className="footer">
                <p>&copy; 2025 LinkUp. Một sản phẩm kết nối con người.</p>
            </footer>
        </div>
    );
}

export default About;