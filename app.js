const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");
const pages = document.querySelectorAll(".page");
const menuItems = document.querySelectorAll(".menu-item");
const statusEl = document.getElementById("status");
const countdown = document.getElementById("countdown");
const countdownLabel = document.getElementById("countdownLabel");
const countEl = document.getElementById("count");
const listEl = document.getElementById("registrationList");
const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("message");
const nameInput = document.getElementById("name");
const studentIdInput = document.getElementById("studentId");
const startText = document.getElementById("startText");

if(document.getElementById("maxText")) {
    document.getElementById("maxText").textContent = MAX_PEOPLE;
}

const startTime = new Date(START_TIME_STRING).getTime();
if(startText) {
    startText.textContent = new Date(startTime).toLocaleString("vi-VN");
}

function openMenu(){
    menu.classList.add("open");
    overlay.classList.add("show");
}

function closeMenu(){
    menu.classList.remove("open");
    overlay.classList.remove("show");
}

function showPage(id){
    pages.forEach(p=>p.classList.toggle("active",p.id===id));
    menuItems.forEach(i=>i.classList.toggle("active",i.dataset.page===id));
    closeMenu();
    window.scrollTo({top:0,behavior:"smooth"});
    if(id==="activity")sync();
}

if(document.getElementById("menuBtn")) document.getElementById("menuBtn").onclick=openMenu;
if(document.getElementById("menuClose")) document.getElementById("menuClose").onclick=closeMenu;
if(overlay) overlay.onclick=closeMenu;

menuItems.forEach(i=>{
    i.onclick=()=>showPage(i.dataset.page);
});

document.querySelectorAll("[data-go]").forEach(b=>{
    b.onclick=()=>showPage(b.dataset.go);
});

function setMessage(text,type){
    message.textContent=text;
    message.className="message show "+type;
}

function updateStatus(count){
    countEl.textContent=count;

    const activityCard = document.querySelector(".activity-card");
    let closedBanner = document.getElementById("closedBanner");

    // Kiểm tra nếu hệ thống thủ công đang đóng / chưa có hoạt động
    if (typeof isRegistrationActive !== 'undefined' && !isRegistrationActive) {
        // Ẩn toàn bộ nội dung con bên trong thẻ hoạt động
        if(activityCard) {
            Array.from(activityCard.children).forEach(child => {
                child.style.display = "none";
            });

            // Tạo hoặc hiển thị thông báo bắt mắt
            if(!closedBanner) {
                closedBanner = document.createElement("div");
                closedBanner.id = "closedBanner";
                closedBanner.style.cssText = "text-align:center; padding:50px 20px; color:#720000;";
                closedBanner.innerHTML = `
                    <div style="font-size:26px; font-weight:bold; letter-spacing:1.5px; margin-bottom:12px; color:#720000; text-transform:uppercase;">
                        CHƯA CÓ HOẠT ĐỘNG ĐỂ ĐĂNG KÝ
                    </div>
                    <div style="font-size:16px; color:#806d5b; font-style:italic;">
                        Vui lòng quay lại sau
                    </div>
                `;
                activityCard.appendChild(closedBanner);
            } else {
                closedBanner.style.display = "block";
            }
        }
        return;
    } else {
        // Nếu bật lại, hiển thị lại các thành phần bên trong card
        if(activityCard) {
            Array.from(activityCard.children).forEach(child => {
                if(child.id !== "closedBanner") child.style.display = "";
            });
            if(closedBanner) closedBanner.style.display = "none";
        }
    }

    if(count>=MAX_PEOPLE){
        statusEl.textContent="● ĐÃ ĐỦ SỐ LƯỢNG";
        statusEl.className="status closed";
        registerBtn.disabled=true;
        countdownLabel.textContent="HOẠT ĐỘNG ĐÃ ĐỦ NGƯỜI";
        countdown.textContent="ĐÃ ĐỦ";
        return;
    }

    if(Date.now()<startTime){
        statusEl.textContent="● CHƯA MỞ ĐĂNG KÝ";
        statusEl.className="status waiting";
        registerBtn.disabled=true;
    }else{
        statusEl.textContent="● ĐANG MỞ ĐĂNG KÝ";
        statusEl.className="status";
        registerBtn.disabled=false;
    }
}

function updateCountdown(){
    if (typeof isRegistrationActive !== 'undefined' && !isRegistrationActive) return;
    if(Number(countEl.textContent)>=MAX_PEOPLE)return;

    const diff=startTime-Date.now();

    if(diff<=0){
        countdownLabel.textContent="ĐĂNG KÝ ĐANG MỞ";
        countdown.textContent="00:00:00";
        statusEl.textContent="● ĐANG MỞ ĐĂNG KÝ";
        statusEl.className="status";
        registerBtn.disabled=false;
        return;
    }

    const s=Math.floor(diff/1000);
    const h=Math.floor(s/3600);
    const m=Math.floor((s%3600)/60);
    const sec=s%60;

    countdownLabel.textContent="ĐĂNG KÝ SẼ MỞ SAU";
    countdown.textContent=[h,m,sec].map(v=>String(v).padStart(2,"0")).join(":");
    registerBtn.disabled=true;
}

setInterval(updateCountdown,1000);
updateCountdown();

async function sync(){
    if (typeof isRegistrationActive !== 'undefined' && !isRegistrationActive) {
        updateStatus(0);
        return;
    }

    try{
        const res=await fetch(SCRIPT_URL+"?event="+encodeURIComponent(EVENT_ID)+"&t="+Date.now());
        if(!res.ok)throw new Error();

        const data=await res.json();
        const list=data.registrations||[];
        const total=Number(data.count)||list.length;

        countEl.textContent=total;
        updateStatus(total);
        listEl.innerHTML="";

        if(!list.length){
            listEl.innerHTML='<tr><td colspan="4" class="empty">Chưa có người đăng ký.</td></tr>';
            return;
        }

        list.forEach((r,i)=>{
            const tr=document.createElement("tr");
            tr.innerHTML="<td>"+(i+1)+"</td><td>"+escapeHtml(r.name)+"</td><td>"+escapeHtml(r.studentId)+"</td><td>"+escapeHtml(r.time||"")+"</td>";
            listEl.appendChild(tr);
        });

    }catch(e){
        listEl.innerHTML='<tr><td colspan="4" class="empty">Không thể tải danh sách. Vui lòng thử lại.</td></tr>';
    }
}

function escapeHtml(v){
    return String(v).replace(/[&<>"']/g,m=>({
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#039;"
    }[m]));
}

if(registerBtn) {
    registerBtn.onclick=async()=>{
        if (typeof isRegistrationActive !== 'undefined' && !isRegistrationActive) return;

        const name=nameInput.value.trim();
        const studentId=studentIdInput.value.trim();

        if(!name){
            setMessage("Vui lòng nhập họ và tên.","error");
            nameInput.focus();
            return;
        }

        if(!studentId){
            setMessage("Vui lòng nhập mã số sinh viên.","error");
            studentIdInput.focus();
            return;
        }

        if(Date.now()<startTime){
            setMessage("Chưa đến thời gian mở đăng ký.","error");
            return;
        }

        if(Number(countEl.textContent)>=MAX_PEOPLE){
            setMessage("Hoạt động đã đủ số lượng.","error");
            return;
        }

        registerBtn.disabled=true;
        registerBtn.textContent="ĐANG GỬI...";
        setMessage("Đang xử lý đăng ký...","success");

        const fd=new FormData();
        fd.append("event",EVENT_ID);
        fd.append("name",name);
        fd.append("studentId",studentId);
        fd.append("time",new Date().toLocaleString("vi-VN"));
        fd.append("maxLimit",MAX_PEOPLE);

        try{
            const res=await fetch(SCRIPT_URL,{
                method:"POST",
                body:fd
            });

            const data=await res.json();

            if(data.status==="success"){
                setMessage("Đăng ký thành công!","success");
                nameInput.value="";
                studentIdInput.value="";
                await sync();
            }else if(data.status==="duplicate"){
                setMessage("MSSV này đã đăng ký hoạt động này trước đó.","error");
                await sync();
            }else if(data.status==="full"){
                setMessage("Hoạt động đã đủ số lượng.","error");
                await sync();
            }else{
                setMessage(data.message||"Không thể đăng ký. Vui lòng thử lại.","error");
            }

        }catch(e){
            setMessage("Không thể kết nối hệ thống. Vui lòng thử lại.","error");
        }finally{
            registerBtn.textContent="ĐĂNG KÝ THAM GIA";

            if(
                typeof isRegistrationActive !== 'undefined' && isRegistrationActive &&
                Number(countEl.textContent)<MAX_PEOPLE &&
                Date.now()>=startTime
            ){
                registerBtn.disabled=false;
            }
        }
    };
}

// Điều khiển nhạc nền
const bgMusic = document.getElementById("bgMusic");
const musicToggleBtn = document.getElementById("musicToggleBtn");

if(musicToggleBtn && bgMusic) {
    let isPlaying = false;
    musicToggleBtn.onclick = () => {
        if(isPlaying) {
            bgMusic.pause();
            musicToggleBtn.textContent = "🎵";
            musicToggleBtn.style.opacity = "0.7";
        } else {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicToggleBtn.textContent = "🔊";
                musicToggleBtn.style.opacity = "1";
            }).catch(e => {
                console.log("Trình duyệt chặn hoặc lỗi phát nhạc:", e);
            });
        }
        isPlaying = !isPlaying;
    };
}

sync();
