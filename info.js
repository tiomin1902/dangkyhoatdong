// Nơi chứa toàn bộ nội dung phần Thông tin Chi đoàn
const chiDoanInfo = {
    tenChiDoan: "2505QLNH",
    nhiemKy: "2026 – 2027",
    donVi: "Đoàn Thanh niên",
    
    // Bạn có thể sửa tên Ban Chấp hành trực tiếp ở đây rất nhanh
    banChapHanh: {
        biThu: "Chưa cập nhật",
        phoBiThu: "Chưa cập nhật",
        uyVien: "Chưa cập nhật"
    },
    
    moTaVej: "Chi đoàn 2505QLNH là tập thể đoàn viên sinh viên cùng học tập, rèn luyện, tham gia công tác Đoàn và các hoạt động tập thể.",
    giaTri: "Đoàn kết • Trách nhiệm • Chủ động • Cống hiến"
};

// Hàm tự động điền dữ liệu vào trang Thông tin khi mở web
document.addEventListener("DOMContentLoaded", () => {
    const infoContainer = document.querySelector("#info .info-grid");
    if(infoContainer) {
        infoContainer.innerHTML = `
            <div class="info-card">
                <h3>Về Chi đoàn</h3>
                <p>${chiDoanInfo.moTaVej}</p>
            </div>

            <div class="info-card">
                <h3>Thông tin nhiệm kỳ</h3>
                <ul class="info-list">
                    <li><strong>Chi đoàn:</strong> ${chiDoanInfo.tenChiDoan}</li>
                    <li><strong>Nhiệm kỳ:</strong> ${chiDoanInfo.nhiemKy}</li>
                    <li><strong>Đơn vị:</strong> ${chiDoanInfo.donVi}</li>
                </ul>
            </div>

            <div class="info-card">
                <h3>Ban Chấp hành</h3>
                <ul class="info-list">
                    <li><strong>Bí thư:</strong> ${chiDoanInfo.banChapHanh.biThu}</li>
                    <li><strong>Phó Bí thư:</strong> ${chiDoanInfo.banChapHanh.phoBiThu}</li>
                    <li><strong>Ủy viên BCH:</strong> ${chiDoanInfo.banChapHanh.uyVien}</li>
                </ul>
            </div>

            <div class="info-card">
                <h3>Giá trị hoạt động</h3>
                <p>${chiDoanInfo.giaTri}</p>
            </div>
        `;
    }
});
