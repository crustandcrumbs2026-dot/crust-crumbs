// INITIALIZE EMAILJS WITH YOUR PUBLIC KEY
(function() {
    emailjs.init("d-_OPKnvgIFALghyb"); 
})();

// EMAILJS CONFIGURATION KEYS
const EMAILJS_SERVICE_ID = "service_ymve7uk";
const EMAILJS_TEMPLATE_ID = "template_e20i1ka";

// STAFF SECURITY PIN CODE SYSTEM
let staffPIN = localStorage.getItem('cnc_staff_pin') || '1234';

// USER ACCOUNTS & SESSION STATE MANAGEMENT
let registeredUsers = JSON.parse(localStorage.getItem('cnc_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('cnc_current_user')) || null;

// EDITABLE CONTACT INFORMATION STATE
const defaultContactInfo = {
    location: 'Metro Manila, Philippines',
    phone: '+63 924 233 0648',
    email: 'support@crustandcrumbs.ph',
    hours: '7:00 AM - 8:00 PM (Mon - Sun)'
};
let contactInfo = JSON.parse(localStorage.getItem('cnc_contact_info')) || defaultContactInfo;

// EDITABLE ABOUT US STORY STATE
const defaultAboutStory = {
    title: 'Our Story',
    subtitle: 'Baked by hand, since 2026',
    content: 'Crust & Crumbs started as a home kitchen on Dimasalang Street. Today, our small team still laminates every croissant by hand and bakes in batches so everything reaches you fresh.'
};
let aboutStory = JSON.parse(localStorage.getItem('cnc_about_story')) || defaultAboutStory;

// OTP SYSTEM GLOBAL STATE
let generatedOTP = null;
let isOTPVerified = false;

const defaultProducts = [
    { id: 1, name: 'Butter Croissant', category: 'pastries', price: 217.51, stock: 15, isAvailable: true, desc: 'Flaky, buttery, traditional French croissant.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80' },
    { id: 2, name: 'Chocolate Lava Cake', category: 'cakes', price: 372.88, stock: 8, isAvailable: true, desc: 'Rich chocolate cake with a molten chocolate center.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80' },
    { id: 3, name: 'Artisanal Sourdough', category: 'breads', price: 341.81, stock: 10, isAvailable: true, desc: 'Naturally fermented bread with a crispy crust.', image: 'https://fareisle.com/wp-content/uploads/2020/04/sourdough-bread-ecourse-06-2.jpg' },
    { id: 4, name: 'Strawberry Macaron', category: 'pastries', price: 155.37, stock: 25, isAvailable: true, desc: 'Sweet almond meringue cookie filled with jam.', image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=500&q=80' },
    { id: 5, name: 'Red Velvet Slice', category: 'cakes', price: 310.74, stock: 2, isAvailable: true, desc: 'Classic red velvet layered with cream cheese frosting.', image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=500&q=80' },
    { id: 6, name: 'Cinnamon Roll', category: 'pastries', price: 248.59, stock: 18, isAvailable: true, desc: 'Warm roll spiced with cinnamon and glazed with icing.', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=500&q=80' }
];

const defaultCustomOptions = {
    syrups: [
        { name: 'Chocolate Syrup', price: 10, isAvailable: true },
        { name: 'Caramel Drizzle', price: 10, isAvailable: true },
        { name: 'White Chocolate', price: 15, isAvailable: true }
    ],
    fruits: [
        { name: 'Fresh Strawberry', price: 20, isAvailable: true },
        { name: 'Cherry on Top', price: 15, isAvailable: true },
        { name: 'Blueberries', price: 25, isAvailable: true }
    ],
    icecream: [
        { name: 'Vanilla Scoop', price: 30, isAvailable: true },
        { name: 'Chocolate Scoop', price: 30, isAvailable: true },
        { name: 'Matcha Scoop', price: 35, isAvailable: true }
    ],
    nuts: [
        { name: 'Sliced Almonds', price: 15, isAvailable: true },
        { name: 'Crushed Pistachio', price: 20, isAvailable: true },
        { name: 'Walnuts', price: 15, isAvailable: true }
    ],
    crunchies: [
        { name: 'Choco Chips', price: 10, isAvailable: true },
        { name: 'Rainbow Sprinkles', price: 10, isAvailable: true },
        { name: 'Oreo Crumbs', price: 15, isAvailable: true }
    ]
};

let products = JSON.parse(localStorage.getItem('cnc_products')) || defaultProducts;
let customOptions = JSON.parse(localStorage.getItem('cnc_custom_options')) || defaultCustomOptions;
let orders = JSON.parse(localStorage.getItem('cnc_orders')) || [
    { id: '#7741', items: '2x Red Velvet Slice [Plate Message: "Happy Birthday Winnie!"]', rawItemsList: [{ name: 'Red Velvet Slice', qty: 2, details: ['Plate Message: "Happy Birthday Winnie!"'], price: 310.74 }], total: 621.48, status: 'Preparing', custName: 'Jo', type: 'Dine-In (Serve at the Table - Table 6)', payment: 'Cash', timestamp: new Date().toLocaleString(), gcashVerified: false },
    { id: '#1001', items: '2x Butter Croissant', rawItemsList: [{ name: 'Butter Croissant', qty: 2, details: [], price: 217.51 }], total: 435.02, status: 'Ready', custName: 'Walk-In Customer', type: 'Take-Out', payment: 'GCash Ref:100293847', timestamp: new Date().toLocaleString(), gcashVerified: false }
];
let orderHistory = JSON.parse(localStorage.getItem('cnc_order_history')) || [];
let trashHistory = JSON.parse(localStorage.getItem('cnc_trash_history')) || [];

let isSelectionMode = false;
let selectedTrashIndices = [];

let cart = [];
let activeCategory = 'all';
let currentlyCustomizingProduct = null;
let selectedNumberCandles = [];

// DOM Elements
const customerView = document.getElementById('customerView');
const staffView = document.getElementById('staffView');
const tvView = document.getElementById('tvView');
const productsGrid = document.getElementById('productsGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalDisplay = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const filterBtns = document.querySelectorAll('.filter-btn');
const staffProductTable = document.getElementById('staffProductTable');
const ordersTableBody = document.getElementById('ordersTableBody');
const searchInput = document.getElementById('searchInput');

function saveState() {
    localStorage.setItem('cnc_products', JSON.stringify(products));
    localStorage.setItem('cnc_custom_options', JSON.stringify(customOptions));
    localStorage.setItem('cnc_orders', JSON.stringify(orders));
    localStorage.setItem('cnc_order_history', JSON.stringify(orderHistory));
    localStorage.setItem('cnc_trash_history', JSON.stringify(trashHistory));
    localStorage.setItem('cnc_user_trash_history', JSON.stringify(userTrashHistory));
    localStorage.setItem('cnc_users', JSON.stringify(registeredUsers));
    localStorage.setItem('cnc_contact_info', JSON.stringify(contactInfo));
    localStorage.setItem('cnc_about_story', JSON.stringify(aboutStory)); // <-- IDADAGDAG ITO
    if (currentUser) {
        localStorage.setItem('cnc_current_user', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('cnc_current_user');
    }
}

function init() {
    renderAuthHeaderUI();
    renderHamburgerMenu();
    renderProducts(products);
    renderStaffTables();
    renderCustomOptionsStaffTable();
    renderTVDisplay();
    renderContactUsUI();
    setupEventListeners();

    setInterval(() => {
        renderTVDisplay();
        renderStaffTables();
    }, 3000);
}

function renderAboutStoryUI() {
    // 1. Para sa Customer About Us View Page
    const titleEl = document.getElementById('displayAboutTitle');
    const subEl = document.getElementById('displayAboutSubtitle');
    const contentEl = document.getElementById('displayAboutContent');

    if (titleEl) titleEl.innerText = aboutStory.title;
    if (subEl) subEl.innerText = aboutStory.subtitle;
    if (contentEl) contentEl.innerText = aboutStory.content;

    // 2. Para sa Staff Dashboard Inputs
    const staffTitle = document.getElementById('staffEditAboutTitle');
    const staffSub = document.getElementById('staffEditAboutSub');
    const staffContent = document.getElementById('staffEditAboutContent');

    if (staffTitle) staffTitle.value = aboutStory.title;
    if (staffSub) staffSub.value = aboutStory.subtitle;
    if (staffContent) staffContent.value = aboutStory.content;
}

function handleSaveAboutStory(e) {
    e.preventDefault();
    aboutStory.title = document.getElementById('staffEditAboutTitle').value.trim();
    aboutStory.subtitle = document.getElementById('staffEditAboutSub').value.trim();
    aboutStory.content = document.getElementById('staffEditAboutContent').value.trim();

    saveState();
    renderAboutStoryUI();
    alert("✅ 'About Us' story updated successfully!");
}

/* --- VIEW NAVIGATION --- */
function switchView(viewName) {
    customerView.classList.remove('active');
    staffView.classList.remove('active');
    tvView.classList.remove('active');
    const reviewsView = document.getElementById('reviewsView');
    if (reviewsView) reviewsView.classList.remove('active');
    const aboutView = document.getElementById('aboutView');
    if (aboutView) aboutView.classList.remove('active');

    // I-clear ang tracker search kapag lumilipat ng view para laging sariwa at malinis pagbalik
    const trackInput = document.getElementById('custOrderTrackInput');
    const trackDisplay = document.getElementById('trackerStatusDisplay');
    if (trackInput) trackInput.value = '';
    if (trackDisplay) trackDisplay.style.display = 'none';

        if (viewName === 'staff') {
        staffView.classList.add('active');
    } else if (viewName === 'tv') {
        tvView.classList.add('active');
    } else if (viewName === 'about') {
        if (aboutView) aboutView.classList.add('active');
    } else if (viewName === 'reviews') {
        if (reviewsView) {
            reviewsView.classList.add('active');
            renderAllCustomerReviewsPage();
        }
    } else {
        customerView.classList.add('active');
    }
}

function toggleStaffOrMenuView() {
    if (staffView.classList.contains('active')) {
        switchView('customer');
    } else {
        promptStaffPIN();
    }
}

function promptStaffPIN() {
    const pin = prompt("🔐 Enter Staff Security PIN Code:");
    if (pin === null) return;
    if (pin === staffPIN) {
        switchView('staff');
    } else {
        alert("❌ Incorrect PIN Code! Access Denied.");
    }
}

function changeStaffPIN() {
    const current = prompt("Enter Current Staff PIN:");
    if (current !== staffPIN) {
        alert("❌ Incorrect current PIN!");
        return;
    }
    const newPin = prompt("Enter New 4-digit Staff PIN:");
    if (newPin && newPin.trim().length >= 4) {
        staffPIN = newPin.trim();
        localStorage.setItem('cnc_staff_pin', staffPIN);
        alert("✅ Staff PIN updated successfully!");
    } else {
        alert("❌ Invalid PIN format!");
    }
}

/* --- CONTACT US REALTIME UPDATE --- */
function renderContactUsUI() {
    document.getElementById('displayContactLocation').innerText = contactInfo.location;
    document.getElementById('displayContactPhone').innerText = contactInfo.phone;
    document.getElementById('displayContactEmail').innerText = contactInfo.email;
    document.getElementById('displayContactHours').innerText = contactInfo.hours;

    document.getElementById('staffEditLocation').value = contactInfo.location;
    document.getElementById('staffEditPhone').value = contactInfo.phone;
    document.getElementById('staffEditEmail').value = contactInfo.email;
    document.getElementById('staffEditHours').value = contactInfo.hours;
}

function handleSaveContactInfo(e) {
    e.preventDefault();
    contactInfo.location = document.getElementById('staffEditLocation').value.trim();
    contactInfo.phone = document.getElementById('staffEditPhone').value.trim();
    contactInfo.email = document.getElementById('staffEditEmail').value.trim();
    contactInfo.hours = document.getElementById('staffEditHours').value.trim();

    saveState();
    renderContactUsUI();
    alert("✅ Contact Information updated successfully!");
}

/* --- OTP & SIGN UP ENFORCEMENT --- */
function checkEmailOTPState() {
    const emailInput = document.getElementById('regEmail');
    const btnGetOTP = document.getElementById('btnGetOTP');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(emailInput.value.trim())) {
        btnGetOTP.disabled = false;
        btnGetOTP.style.background = "var(--primary-color)";
        btnGetOTP.style.cursor = "pointer";
    } else {
        btnGetOTP.disabled = true;
        btnGetOTP.style.background = "#888";
        btnGetOTP.style.cursor = "not-allowed";
    }
}

function handleGetOTP() {
    const email = document.getElementById('regEmail').value.trim();
    const firstName = document.getElementById('regFirstName').value.trim() || 'Customer';
    const btnGetOTP = document.getElementById('btnGetOTP');

    if (!email) {
        alert("Please enter a valid email address!");
        return;
    }

    // Generate random 6-digit OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    isOTPVerified = false;

    // UI Feedback habang nagpapadala
    btnGetOTP.disabled = true;
    btnGetOTP.innerText = "Sending...";
    btnGetOTP.style.background = "#888";

    // Parameters na ipapasa sa EmailJS template
    const templateParams = {
        to_email: email,
        to_name: firstName,
        otp_code: generatedOTP
    };

    // Totoong Pagpapadala ng Email sa mismong ininput ni user
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('OTP Email Sent Successfully!', response.status, response.text);
            
            document.getElementById('otpGroup').style.display = 'block';
            document.getElementById('otpStatusText').innerText = `✅ Real OTP code sent to ${email}! Please check your Inbox / Spam folder.`;
            document.getElementById('otpStatusText').style.color = '#0c5460';

            btnGetOTP.innerText = "Resend OTP";
            btnGetOTP.disabled = false;
            btnGetOTP.style.background = "var(--primary-color)";

            alert(`📧 Success! A real OTP verification code has been sent to ${email}. Please check your email inbox or spam folder.`);
        }, function(error) {
            console.error('Failed to send OTP Email:', error);
            
            btnGetOTP.innerText = "Get OTP";
            btnGetOTP.disabled = false;
            btnGetOTP.style.background = "var(--primary-color)";

            alert("❌ Failed to send OTP email. Please make sure your email address is correct or try again later.");
        });
}

function verifyEnteredOTP() {
    const inputOTP = document.getElementById('regOTPInput').value.trim();
    const statusText = document.getElementById('otpStatusText');
    const btnReg = document.getElementById('btnRegisterSubmit');

    if (inputOTP === generatedOTP && generatedOTP !== null) {
        isOTPVerified = true;
        statusText.innerText = "✅ OTP Code Verified Successfully!";
        statusText.style.color = "#2e7d32";

        btnReg.disabled = false;
        btnReg.style.backgroundColor = "var(--primary-color)";
        btnReg.style.cursor = "pointer";
        alert("✅ Email verified! You can now proceed to complete registration.");
    } else {
        isOTPVerified = false;
        statusText.innerText = "❌ Invalid OTP Code. Please check and try again.";
        statusText.style.color = "#e63946";

        btnReg.disabled = true;
        btnReg.style.backgroundColor = "#888";
        btnReg.style.cursor = "not-allowed";
    }
}

/* --- AUTH & HAMBURGER DRAWER --- */
function toggleHamburgerDrawer() {
    const drawer = document.getElementById('hamburgerDrawer');
    drawer.classList.toggle('open');
    overlay.classList.toggle('active', drawer.classList.contains('open'));
}

function closeAllDrawersAndModals() {
    document.getElementById('hamburgerDrawer').classList.remove('open');
    document.getElementById('cartDrawer').classList.remove('open');
    overlay.classList.remove('active');
    document.querySelectorAll('.custom-modal').forEach(m => m.classList.remove('active'));
    
    // Awtomatikong ire-reset ang lahat ng toggle eye icons
    resetAllPasswordToggles();
}

function renderAuthHeaderUI() {
    const authContainer = document.getElementById('authNavContainer');
    const cartBtn = document.getElementById('cartBtn');

    if (currentUser) {
        cartBtn.style.display = 'block';
        authContainer.innerHTML = `<button class="user-account-btn" onclick="openProfileModal()">👤 ${currentUser.firstName}</button>`;
    } else {
        cartBtn.style.display = 'none';
        authContainer.innerHTML = `<button class="signin-btn" onclick="openModal('signInModal')">Sign In</button>`;
    }
}

function renderHamburgerMenu() {
    const menuList = document.getElementById('hamburgerMenuList');
    if (!menuList) return;

    // 1. KUNG SI ADMIN / STAFF ANG NAKA-LOG IN
    if (currentUser && currentUser.role === 'staff') {
        menuList.innerHTML = `
            <button class="drawer-menu-btn" style="color: var(--accent-color);" onclick="handleLogout()">🚪 Logout (Admin)</button>
        `;
    } 
    // 2. KUNG WALANG NAKA-LOG IN (GUEST / CUSTOMER)
    else if (!currentUser) {
        menuList.innerHTML = `
            <button class="drawer-menu-btn" onclick="closeAllDrawersAndModals(); openModal('signInModal');">🔑 Login or Signup</button>
            <button class="drawer-menu-btn" onclick="closeAllDrawersAndModals(); switchView('about');">📖 About Us (Our Story)</button>
        `;
    } 
    // 3. KUNG REGULAR CUSTOMER ANG NAKA-LOG IN
    else {
        menuList.innerHTML = `
            <button class="drawer-menu-btn" onclick="closeAllDrawersAndModals(); switchView('customer');">🏠 Home (Menu Page)</button>
            <button class="drawer-menu-btn" onclick="closeAllDrawersAndModals(); openUserOrderHistory();">🛍️ Order History</button>
            <button class="drawer-menu-btn" onclick="closeAllDrawersAndModals(); switchView('tv');">📺 Track My Order</button>
            <button class="drawer-menu-btn" onclick="closeAllDrawersAndModals(); switchView('about');">📖 About Us (Our Story)</button>
            <button class="drawer-menu-btn" onclick="closeAllDrawersAndModals(); switchView('reviews');">⭐ Customer Reviews</button>
            <button class="drawer-menu-btn" style="color: var(--accent-color);" onclick="handleLogout()">🚪 Logout (${currentUser.firstName})</button>
        `;
    }
}

function openModal(id) {
    closeAllDrawersAndModals();
    
    // Automatic na lilinisin ang input fields at ire-reset ang toggle eyes
    if (id === 'signInModal') {
        const form = document.getElementById('signInForm');
        if (form) form.reset();
        const emailEl = document.getElementById('loginEmail');
        const passEl = document.getElementById('loginPassword');
        if (emailEl) emailEl.value = '';
        if (passEl) passEl.value = '';
    }

    resetAllPasswordToggles(); // <-- IDADAGDAG DITO

    document.getElementById(id).classList.add('active');
    overlay.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    overlay.classList.remove('active');
}

function switchToSignUp() {
    closeModal('signInModal');
    generatedOTP = null;
    isOTPVerified = false;
    document.getElementById('otpGroup').style.display = 'none';
    document.getElementById('regOTPInput').value = '';
    document.getElementById('btnGetOTP').disabled = true;
    document.getElementById('btnRegisterSubmit').disabled = true;
    document.getElementById('btnRegisterSubmit').style.backgroundColor = "#888";
    document.getElementById('btnRegisterSubmit').style.cursor = "not-allowed";
    openModal('signUpModal');
}

function validateSignUpPassword() {
    const p = document.getElementById('regPassword').value;
    const hasLower = /[a-z]/.test(p);
    const hasUpper = /[A-Z]/.test(p);
    const hasNum = /[0-9]/.test(p);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(p);
    const hasLen = p.length >= 8;
    const noSpace = !/\s/.test(p);

    toggleCheck('chk-lower', hasLower);
    toggleCheck('chk-upper', hasUpper);
    toggleCheck('chk-num', hasNum);
    toggleCheck('chk-special', hasSpecial);
    toggleCheck('chk-len', hasLen);
    toggleCheck('chk-space', noSpace && p.length > 0);

    return hasLower && hasUpper && hasNum && hasSpecial && hasLen && noSpace;
}

function toggleCheck(elementId, isValid) {
    const el = document.getElementById(elementId);
    if (isValid) el.classList.add('valid');
    else el.classList.remove('valid');
}

document.getElementById('signUpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!isOTPVerified) {
        alert("❌ Please verify your OTP code before registering!");
        return;
    }

    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (!validateSignUpPassword()) {
        alert("❌ Password does not meet security requirements!");
        return;
    }
    if (password !== confirmPassword) {
        alert("❌ Passwords do not match!");
        return;
    }
    if (registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert("❌ Account with this email already exists!");
        return;
    }

    const newUser = { firstName, lastName, phone, email, password };
    registeredUsers.push(newUser);
    currentUser = newUser;
    saveState();

    alert("🎉 Account created successfully!");
    closeModal('signUpModal');
    renderAuthHeaderUI();
    renderHamburgerMenu();
});

document.getElementById('signInForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    // 1. I-check muna kung ito ang Admin/Staff email
    if (email === "crustandcrumbs2026@gmail.com") {
        // Pwede nating i-verify ang password para sa admin (halimbawa ay "admin123" o depende sa gusto mo)
        if (password === "admin123" || password === "crustandcrumbs2026") {
            currentUser = { firstName: "Admin", email: email, role: "staff" };
            saveState();
            
            alert("Welcome back, Admin! Pumasok na sa Dashboard.");
            switchView('staff'); // Dadalhin sa Staff Operations Portal
            
            closeModal('signInModal');
            renderAuthHeaderUI();
            renderHamburgerMenu();
            
            // Linisin ang inputs
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            return;
        } else {
            alert("❌ Incorrect password for Admin portal!");
            return;
        }
    }

    // 2. Para sa mga Regular Customers (Literal na kahit anong email)
    const user = registeredUsers.find(u => u.email.toLowerCase() === email && u.password === password);

    if (user) {
        currentUser = user;
        saveState();

        alert(`Welcome back, ${user.firstName}!`);
        switchView('customer'); // Dadalhin sa Customer Menu
        
        closeModal('signInModal');
        renderAuthHeaderUI();
        renderHamburgerMenu();
        
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        alert("❌ Invalid email or password! Please check your details or create an account.");
    }
});

function handleLogout() {
    currentUser = null;
    saveState();

    // I-clear din ang sign in form fields para sa account security
    const signInForm = document.getElementById('signInForm');
    if (signInForm) signInForm.reset();
    const emailEl = document.getElementById('loginEmail');
    const passEl = document.getElementById('loginPassword');
    if (emailEl) emailEl.value = '';
    if (passEl) passEl.value = '';

    resetAllPasswordToggles(); // <-- IDADAGDAG DITO

    alert("You have logged out.");
    renderAuthHeaderUI();
    renderHamburgerMenu();
    switchView('customer');
}

function openProfileModal() {
    if (!currentUser) return;
    document.getElementById('profFullName').value = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('profPhone').value = currentUser.phone;
    document.getElementById('profEmail').value = currentUser.email;
    openModal('profileModal');
}

document.getElementById('profileUpdateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!currentUser) return;
    const nameParts = document.getElementById('profFullName').value.trim().split(' ');
    currentUser.firstName = nameParts[0] || currentUser.firstName;
    currentUser.lastName = nameParts.slice(1).join(' ') || currentUser.lastName;
    currentUser.phone = document.getElementById('profPhone').value.trim();
    currentUser.email = document.getElementById('profEmail').value.trim();
    saveState();
    alert("✅ Account updated!");
    closeModal('profileModal');
    renderAuthHeaderUI();
    renderHamburgerMenu();
});

function handleChangeProfilePassword() {
    const oldP = prompt("Enter Current Password:");
    if (oldP !== currentUser.password) {
        alert("❌ Incorrect password!");
        return;
    }
    const newP = prompt("Enter New Password:");
    if (newP && newP.length >= 8) {
        currentUser.password = newP;
        saveState();
        alert("✅ Password changed successfully!");
    } else {
        alert("❌ Invalid password length.");
    }
}

function handleResetPassword() {
    const email = prompt("Enter your registered email address:");
    if (!email) return;
    const user = registeredUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (user) {
        const newP = prompt("Account verified! Enter new password:");
        if (newP && newP.length >= 8) {
            user.password = newP;
            saveState();
            alert("✅ Password reset successfully!");
        } else {
            alert("❌ Invalid password.");
        }
    } else {
        alert("❌ Email not found!");
    }
}

/* --- PRODUCTS & CUSTOMIZATION --- */
function getTopSellingProductName() {
    let salesMap = {};
    orders.forEach(o => {
        if (o.rawItemsList && Array.isArray(o.rawItemsList)) {
            o.rawItemsList.forEach(item => {
                salesMap[item.name] = (salesMap[item.name] || 0) + item.qty;
            });
        }
    });
    let maxQty = 0;
    let topProduct = null;
    for (let name in salesMap) {
        if (salesMap[name] > maxQty) {
            maxQty = salesMap[name];
            topProduct = name;
        }
    }
    return topProduct;
}

function renderProducts(items) {
    productsGrid.innerHTML = '';
    const topSellerName = getTopSellingProductName();

    items.forEach(p => {
        const isBestSeller = (p.name === topSellerName);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${isBestSeller ? '<span class="best-seller-tag">🔥 Best Seller</span>' : ''}
            <img src="${p.image}" alt="${p.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-price-row">
                    <span class="product-price">₱${p.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="openCustomizationModal(${p.id})">Add & Customize</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

function openCustomizationModal(productId) {
    currentlyCustomizingProduct = products.find(p => p.id === productId);
    if (!currentlyCustomizingProduct) return;

    document.getElementById('customModalItemTitle').innerText = `Customize: ${currentlyCustomizingProduct.name}`;
    document.querySelectorAll('input[name="dedicationType"]')[0].checked = true;
    document.getElementById('dedicationMessage').value = '';
    document.getElementById('dedicationTextGroup').style.display = 'none';

    populateAddonSelect('selSyrup', customOptions.syrups);
    populateAddonSelect('selFruit', customOptions.fruits);
    populateAddonSelect('selIceCream', customOptions.icecream);
    populateAddonSelect('selNuts', customOptions.nuts);
    populateAddonSelect('selCrunch', customOptions.crunchies);

    ['chkSyrup', 'chkFruit', 'chkIceCream', 'chkNuts', 'chkCrunch'].forEach(id => {
        document.getElementById(id).checked = false;
    });
    ['selSyrup', 'selFruit', 'selIceCream', 'selNuts', 'selCrunch'].forEach(id => {
        document.getElementById(id).disabled = true;
    });

    selectedNumberCandles = [];
    renderNumberCandlesList();
    document.getElementById('spiralCandleQty').innerText = '0';
    document.getElementById('sparklerCandleQty').innerText = '0';
    document.getElementById('allergyNotes').value = '';

    openModal('customizationModal');
}

function populateAddonSelect(selectId, optionsList) {
    const sel = document.getElementById(selectId);
    sel.innerHTML = '';
    optionsList.filter(opt => opt.isAvailable !== false).forEach(opt => {
        const optionEl = document.createElement('option');
        optionEl.value = opt.name;
        optionEl.dataset.price = opt.price;
        optionEl.innerText = `${opt.name} (+₱${opt.price.toFixed(2)})`;
        sel.appendChild(optionEl);
    });
}

function toggleDedicationTextarea() {
    const val = document.querySelector('input[name="dedicationType"]:checked').value;
    document.getElementById('dedicationTextGroup').style.display = (val === 'none') ? 'none' : 'block';
}

function toggleAddonSelect(chkId, selId) {
    const chk = document.getElementById(chkId);
    document.getElementById(selId).disabled = !chk.checked;
}

function addNumberCandleSelection() {
    const num = document.getElementById('candleNumVal').value;
    selectedNumberCandles.push(num);
    renderNumberCandlesList();
}

function removeNumberCandleSelection(idx) {
    selectedNumberCandles.splice(idx, 1);
    renderNumberCandlesList();
}

function renderNumberCandlesList() {
    const box = document.getElementById('numberCandlesList');
    box.innerHTML = '';
    selectedNumberCandles.forEach((num, idx) => {
        box.innerHTML += `
            <span style="background: #e0e0e0; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 4px; display: inline-flex; align-items: center; gap: 4px;">
                #${num} (+₱15.00) <b style="cursor:pointer; color:red;" onclick="removeNumberCandleSelection(${idx})">&times;</b>
            </span>
        `;
    });
}

function changeCandleQty(elementId, delta) {
    const el = document.getElementById(elementId);
    let current = parseInt(el.innerText) || 0;
    current = Math.max(0, current + delta);
    el.innerText = current;
}

function confirmAddToCartCustomized() {
    if (!currentlyCustomizingProduct) return;

    let extraTotal = 0;
    let details = [];

    const dedType = document.querySelector('input[name="dedicationType"]:checked').value;
    const dedMsg = document.getElementById('dedicationMessage').value.trim();
    if (dedType === 'plate') {
        details.push(`Plate Message: "${dedMsg || 'Happy Celebration'}"`);
    } else if (dedType === 'card') {
        extraTotal += 15;
        details.push(`Greeting Card (+₱15): "${dedMsg || 'Best Wishes'}"`);
    }

    const addons = [
        { chk: 'chkSyrup', sel: 'selSyrup', label: 'Syrup' },
        { chk: 'chkFruit', sel: 'selFruit', label: 'Fruit' },
        { chk: 'chkIceCream', sel: 'selIceCream', label: 'Ice Cream' },
        { chk: 'chkNuts', sel: 'selNuts', label: 'Nuts' },
        { chk: 'chkCrunch', sel: 'selCrunch', label: 'Topping' }
    ];

    addons.forEach(a => {
        if (document.getElementById(a.chk).checked) {
            const selEl = document.getElementById(a.sel);
            const optName = selEl.value;
            const optPrice = parseFloat(selEl.options[selEl.selectedIndex].dataset.price) || 0;
            extraTotal += optPrice;
            details.push(`${a.label}: ${optName} (+₱${optPrice.toFixed(2)})`);
        }
    });

    if (selectedNumberCandles.length > 0) {
        const cost = selectedNumberCandles.length * 15;
        extraTotal += cost;
        details.push(`Number Candles: #${selectedNumberCandles.join(', #')} (+₱${cost.toFixed(2)})`);
    }

    const spiralQty = parseInt(document.getElementById('spiralCandleQty').innerText) || 0;
    if (spiralQty > 0) {
        const cost = spiralQty * 5;
        extraTotal += cost;
        details.push(`${spiralQty}x Spiral Candle (+₱${cost.toFixed(2)})`);
    }

    const sparklerQty = parseInt(document.getElementById('sparklerCandleQty').innerText) || 0;
    if (sparklerQty > 0) {
        const cost = sparklerQty * 30;
        extraTotal += cost;
        details.push(`${sparklerQty}x Sparkler Candle (+₱${cost.toFixed(2)})`);
    }

    const allergy = document.getElementById('allergyNotes').value.trim();
    if (allergy) details.push(`⚠️ Note: ${allergy}`);

    const finalUnitPrice = currentlyCustomizingProduct.price + extraTotal;

    const cartItem = {
        id: Date.now(),
        productId: currentlyCustomizingProduct.id,
        name: currentlyCustomizingProduct.name,
        unitPrice: finalUnitPrice,
        qty: 1,
        details: details
    };

    cart.push(cartItem);
    updateCart();
    closeModal('customizationModal');
    document.getElementById('cartDrawer').classList.add('open');
    overlay.classList.add('active');
}

/* --- CART & CHECKOUT --- */
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.unitPrice * item.qty;
        total += itemTotal;
        itemCount += item.qty;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div>
                <div style="font-weight: bold; font-size: 0.95rem;">${item.name}</div>
                <div style="font-size: 0.8rem; color: #666;">₱${item.unitPrice.toFixed(2)} each</div>
                ${item.details.length > 0 ? `<div style="font-size: 0.75rem; color: #888; margin-top:2px;">${item.details.join(' | ')}</div>` : ''}
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeCartQty(${index}, -1)">-</button>
                    <span style="font-size: 0.85rem; font-weight: bold;">${item.qty}</span>
                    <button class="qty-btn" onclick="changeCartQty(${index}, 1)">+</button>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: bold; font-size: 0.95rem; color: var(--primary-color);">₱${itemTotal.toFixed(2)}</div>
                <button class="delete-btn" style="padding: 2px 6px; font-size: 0.7rem; margin-top: 4px;" onclick="removeFromCart(${index})">✕</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartTotalDisplay.innerText = `₱${total.toFixed(2)}`;
    cartBadge.innerText = itemCount;
}

function changeCartQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    if (!currentUser) {
        alert("You need to login first!");
        openModal('signInModal');
        return;
    }

    document.getElementById('checkoutDetailsForm').reset();
    document.getElementById('custName').value = `${currentUser.firstName} ${currentUser.lastName}`.trim();
    
    // Auto-fill ng active mobile number mula sa ginamit na account ni user
    document.getElementById('activeMobileNo').value = currentUser.phone || '';

    document.getElementById('paymentMethod').value = 'Cash on Delivery (COD)';
    document.getElementById('gcashFields').style.display = 'none';

    closeAllDrawersAndModals();
    openModal('checkoutModal');
}

function toggleTableNo() {
    const type = document.getElementById('orderType').value;
    document.getElementById('dineInOptionGroup').style.display = (type === 'Dine-In') ? 'block' : 'none';
    document.getElementById('tableNoGroup').style.display = (type === 'Dine-In') ? 'block' : 'none';
}

function toggleSeniorDiscount() {
    const chk = document.getElementById('chkSeniorDiscount');
    document.getElementById('seniorIdGroup').style.display = chk.checked ? 'block' : 'none';
}

function togglePaymentFields() {
    const method = document.getElementById('paymentMethod').value;
    document.getElementById('gcashFields').style.display = (method.includes('GCash')) ? 'block' : 'none';
}

function calculateChange() {
    let total = cart.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0);
    if (document.getElementById('chkSeniorDiscount').checked) total *= 0.80;
    const tendered = parseFloat(document.getElementById('amountTendered').value) || 0;
    const change = Math.max(0, tendered - total);
    document.getElementById('changeDisplay').innerText = `₱${change.toFixed(2)}`;
}

document.getElementById('checkoutDetailsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let total = cart.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0);

    const custName = document.getElementById('custName').value.trim() || 'Guest';
    const address = document.getElementById('deliveryAddress').value.trim();
    const mapLink = document.getElementById('googleMapLink').value.trim();
    const activeNo = document.getElementById('activeMobileNo').value.trim();
    const notes = document.getElementById('riderNotes').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;

    let typeString = `Delivery | Addr: ${address}`;
    if (mapLink) typeString += ` | Map: ${mapLink}`;
    typeString += ` | Mobile: ${activeNo}`;
    if (notes) typeString += ` | Note: ${notes}`;

    let paymentString = paymentMethod;
    if (paymentMethod.includes('GCash')) {
        const gcashRef = document.getElementById('gcashRef').value.trim();
        if (!gcashRef) {
            alert("❌ Please enter GCash Reference Number!");
            return;
        }
        paymentString += ` Ref:${gcashRef}`;
    }

    const rawItemsList = cart.map(item => ({
        name: item.name, qty: item.qty, details: item.details, price: item.unitPrice
    }));
    const itemsSummary = cart.map(i => `${i.qty}x ${i.name}${i.details.length > 0 ? ' [' + i.details.join(', ') + ']' : ''}`).join(', ');
    const newOrderId = '#' + Math.floor(1000 + Math.random() * 9000);

    const newOrder = {
        id: newOrderId, custName, userEmail: currentUser ? currentUser.email : '',
        type: typeString, items: itemsSummary, rawItemsList, total,
        status: 'Received', payment: paymentString, timestamp: new Date().toLocaleString(), gcashVerified: false
    };

    orders.unshift(newOrder);
    cart.forEach(c => {
        const p = products.find(prod => prod.id === c.productId);
        if (p) p.stock = Math.max(0, p.stock - c.qty);
    });

    saveState();
    playDingSound();

    renderReceiptStub(newOrder);
    closeModal('checkoutModal');
    openModal('receiptModal');

    cart = [];
    updateCart();
    renderStaffTables();
    renderTVDisplay();
    renderProducts(products);
});

function renderReceiptStub(order) {
    document.getElementById('receiptContent').innerHTML = `
        <div style="text-align: center; border-bottom: 1px dashed #ccc; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
            <h3>🥐 Crust & Crumbs Pastry Shop</h3>
            <p style="font-size: 0.75rem;">Official Digital Claim Stub</p>
        </div>
        <div class="receipt-number">${order.id}</div>
        <p><strong>Customer:</strong> ${order.custName}</p>
        <p><strong>Order Type:</strong> ${order.type}</p>
        <p><strong>Date & Time:</strong> ${order.timestamp}</p>
        <hr style="margin: 0.5rem 0; border: none; border-top: 1px dashed #ccc;">
        <p><strong>Items Ordered:</strong></p>
        <p style="font-size: 0.85rem; margin-bottom: 0.5rem;">${order.items}</p>
        <hr style="margin: 0.5rem 0; border: none; border-top: 1px dashed #ccc;">
        <p style="font-size: 1.1rem; text-align: right;"><strong>Total Paid: ₱${order.total.toFixed(2)}</strong></p>
        <p style="font-size: 0.8rem; text-align: right; color: #666;">Method: ${order.payment}</p>
    `;
}

/* --- STAFF OPERATIONS --- */
function renderStaffTables() {
    renderOrdersTable();
    renderInventoryTable();
    renderTopSellingList();
    renderKPICards();
}

function renderOrdersTable() {
    ordersTableBody.innerHTML = '';
    orders.forEach((o, index) => {
        const isGCash = o.payment.includes('GCash');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${o.id}</strong><br><small style="color:#777;">${o.timestamp}</small><br><small><b>Cust:</b> ${o.custName}</small></td>
            <td><small>${o.items}</small><br><span style="font-size: 0.75rem; color: var(--primary-color); font-weight: bold;">${o.type}</span></td>
            <td><strong>₱${o.total.toFixed(2)}</strong><br><small style="color:#666;">${o.payment}</small><br>${isGCash ? `<button class="gcash-verify-btn ${o.gcashVerified ? 'gcash-verified' : 'gcash-unverified'}" onclick="toggleGCashVerification(${index})">${o.gcashVerified ? '✓ Verified' : '⚠️ Unverified'}</button>` : ''}</td>
            <td>
                <select class="status-select status-${o.status.replace(/\s+/g, '')}" onchange="updateOrderStatus(${index}, this.value)">
                    <option value="Received" ${o.status === 'Received' ? 'selected' : ''}>Received</option>
                    <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="Ready for Courier Pick-Up" ${o.status === 'Ready for Courier Pick-Up' ? 'selected' : ''}>Ready for Courier Pick-Up</option>
                    <option value="Handed To Delivery Rider" ${o.status === 'Handed To Delivery Rider' ? 'selected' : ''}>Handed To Delivery Rider</option>
                    <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td><button class="kot-btn" onclick="printKitchenSlip(${index})">🍳 Print KOT</button></td>
            <td><button class="kot-btn" onclick="openRiderDetails(${index})">🛵 Rider Details</button></td>
        `;
        ordersTableBody.appendChild(row);
    });
}

function updateOrderStatus(index, newStatus) {
    orders[index].status = newStatus;
    saveState();
    renderStaffTables();
    renderTVDisplay();
}

function toggleGCashVerification(index) {
    orders[index].gcashVerified = !orders[index].gcashVerified;
    saveState();
    renderOrdersTable();
}

function printKitchenSlip(index) {
    const o = orders[index];
    
    let kotModal = document.getElementById('kotSlipModal');
    
    if (!kotModal) {
        kotModal = document.createElement('div');
        kotModal.id = 'kotSlipModal';
        kotModal.className = 'custom-modal';
        kotModal.style.maxWidth = '450px';
        document.body.appendChild(kotModal);
    }

    kotModal.innerHTML = `
        <div class="modal-header">
            <h3>🍳 KITCHEN ORDER TICKET (KOT)</h3>
            <button class="close-modal-btn" onclick="closeModal('kotSlipModal')">&times;</button>
        </div>
        <div style="text-align: center; font-family: monospace;">
            <div style="font-size: 1.5rem; font-weight: bold; background: #e65100; color: white; padding: 6px; border-radius: 6px; margin-bottom: 1rem;">
                ${o.id}
            </div>
            <div style="text-align: left; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5;">
                <p><b>Customer Name:</b> ${o.custName}</p>
                <p><b>Order Option:</b> ${o.type}</p>
                <p><b>Time:</b> ${o.timestamp}</p>
            </div>
            <hr style="border: none; border-top: 1px dashed #ccc; margin: 0.8rem 0;">
            <div style="text-align: left; font-size: 1rem; font-weight: bold; margin-bottom: 1rem;">
                ${o.items.split(', ').join('<br>')}
            </div>
            <hr style="border: none; border-top: 1px dashed #ccc; margin: 0.8rem 0;">
            <p style="font-size: 0.75rem; color: #666; margin-bottom: 1rem;">— ISSUSULAT SA PAPEL AT IIBIGAY SA KUSINA —</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" class="no-print">
            <button class="form-btn" onclick="window.print()" style="background-color: #333; flex: 1;">🖨️ Print Ticket</button>
            <button class="form-btn" onclick="closeModal('kotSlipModal')" style="background-color: var(--primary-color); width: auto;">Close Window</button>
        </div>
    `;

    openModal('kotSlipModal');
}

function openRiderDetails(index) {
    const o = orders[index];
    
    let riderModal = document.getElementById('riderDetailsModal');
    
    if (!riderModal) {
        riderModal = document.createElement('div');
        riderModal.id = 'riderDetailsModal';
        riderModal.className = 'custom-modal';
        riderModal.style.maxWidth = '450px';
        document.body.appendChild(riderModal);
    }

    const currentRiderName = o.riderName || '';
    const currentRiderContact = o.riderContact || '';

    riderModal.innerHTML = `
        <div class="modal-header">
            <h3>🛵 ASSIGN DELIVERY RIDER</h3>
            <button class="close-modal-btn" onclick="closeModal('riderDetailsModal')">&times;</button>
        </div>
        <div style="text-align: left; font-family: monospace; margin-bottom: 1rem;">
            <div style="font-size: 1.3rem; font-weight: bold; background: var(--primary-color); color: white; padding: 6px; border-radius: 6px; margin-bottom: 1rem; text-align: center;">
                Order ID: ${o.id}
            </div>
            <div style="font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5;">
                <p><b>Customer Name:</b> ${o.custName}</p>
                <p><b>Order Option:</b> ${o.type}</p>
            </div>
            <hr style="border: none; border-top: 1px dashed #ccc; margin: 0.8rem 0;">
            <form id="riderDetailsForm" onsubmit="saveRiderDetails(event, ${index})">
                <div style="margin-bottom: 0.8rem;">
                    <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 4px;">Rider Name:</label>
                    <input type="text" id="inputRiderName" value="${currentRiderName}" placeholder="Enter rider name..." required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: inherit;">
                </div>
                <div style="margin-bottom: 1.2rem;">
                    <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 4px;">Contact Number:</label>
                    <input type="text" id="inputRiderContact" value="${currentRiderContact}" placeholder="Enter contact number..." required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: inherit;">
                </div>
                <div style="display: flex; gap: 0.5rem;" class="no-print">
                    <button type="submit" class="form-btn" style="background-color: var(--primary-color); flex: 1;">💾 Save Rider Details</button>
                    <button type="button" class="form-btn" onclick="closeModal('riderDetailsModal')" style="background-color: #666; width: auto;">Close</button>
                </div>
            </form>
        </div>
    `;

    openModal('riderDetailsModal');
}

function saveRiderDetails(event, index) {
    event.preventDefault();
    
    const newName = document.getElementById('inputRiderName').value;
    const newContact = document.getElementById('inputRiderContact').value;

    orders[index].riderName = newName;
    orders[index].riderContact = newContact;

    saveState();

    alert("Rider details updated successfully!");
    closeModal('riderDetailsModal');

    renderOrdersTable();
    if (typeof renderTVDisplay === 'function') renderTVDisplay();
}

function renderInventoryTable() {
    staffProductTable.innerHTML = '';
    products.forEach((p, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${p.name}</strong>${p.stock <= 5 ? '<span class="low-stock-badge">LOW STOCK</span>' : ''}</td>
            <td>${p.category}</td>
            <td>₱${p.price.toFixed(2)}</td>
            <td><input type="number" value="${p.stock}" min="0" style="width: 60px; padding: 2px 4px;" onchange="updateProductStock(${index}, this.value)"></td>
            <td><button class="delete-btn" onclick="deleteProduct(${index})">Delete</button></td>
        `;
        staffProductTable.appendChild(row);
    });
}

function updateProductStock(index, newStock) {
    products[index].stock = parseInt(newStock) || 0;
    saveState();
    renderProducts(products);
}

function deleteProduct(index) {
    if (confirm("Delete this product from menu?")) {
        products.splice(index, 1);
        saveState();
        renderProducts(products);
        renderStaffTables();
    }
}

document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('prodName').value.trim();
    const category = document.getElementById('prodCategory').value;
    const price = parseFloat(document.getElementById('prodPrice').value);
    const stock = parseInt(document.getElementById('prodStock').value);
    const desc = document.getElementById('prodDesc').value.trim();
    const image = document.getElementById('prodImage').value.trim();

    products.unshift({ id: Date.now(), name, category, price, stock, isAvailable: true, desc, image });
    saveState();
    this.reset();
    renderProducts(products);
    renderStaffTables();
    alert("✅ Product added successfully!");
});

function renderCustomOptionsStaffTable() {
    const tableBody = document.getElementById('customOptionsTableBody');
    tableBody.innerHTML = '';

    for (let category in customOptions) {
        customOptions[category].forEach((opt, idx) => {
            const isAvail = opt.isAvailable !== false;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-transform: capitalize;">${category}</td>
                <td>${opt.name}</td>
                <td>₱${opt.price.toFixed(2)}</td>
                <td>
                    <button class="availability-toggle-btn ${isAvail ? 'btn-available' : 'btn-not-available'}" onclick="toggleCustomOptionAvailability('${category}', ${idx})">
                        ${isAvail ? 'Available' : 'Not Available'}
                    </button>
                </td>
                <td><button class="delete-btn" style="padding: 2px 6px; font-size: 0.75rem;" onclick="deleteCustomOption('${category}', ${idx})">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function toggleCustomOptionAvailability(category, idx) {
    const current = customOptions[category][idx].isAvailable !== false;
    customOptions[category][idx].isAvailable = !current;
    saveState();
    renderCustomOptionsStaffTable();
}

document.getElementById('addCustomOptionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const category = document.getElementById('customOptCategory').value;
    const name = document.getElementById('customOptName').value.trim();
    const price = parseFloat(document.getElementById('customOptPrice').value) || 0;

    if (!customOptions[category]) customOptions[category] = [];
    customOptions[category].push({ name, price, isAvailable: true });
    saveState();
    renderCustomOptionsStaffTable();
    this.reset();
    alert("✅ Custom Option added!");
});

function deleteCustomOption(category, idx) {
    if (confirm("Delete this custom option?")) {
        customOptions[category].splice(idx, 1);
        saveState();
        renderCustomOptionsStaffTable();
    }
}

function renderTopSellingList() {
    const listContainer = document.getElementById('topSellingList');
    let itemCounts = {};
    orders.forEach(o => {
        if (o.rawItemsList && Array.isArray(o.rawItemsList)) {
            o.rawItemsList.forEach(item => {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
            });
        }
    });

    const sorted = Object.keys(itemCounts).sort((a, b) => itemCounts[b] - itemCounts[a]);
    if (sorted.length === 0) {
        listContainer.innerHTML = '<span style="color:#888;">No sales recorded today yet.</span>';
        return;
    }

    let html = '<ol style="padding-left: 1.2rem;">';
    sorted.slice(0, 5).forEach((name, idx) => {
        html += `<li><strong>${name}</strong> — ${itemCounts[name]} sold ${idx === 0 ? '🔥 (Best Seller)' : ''}</li>`;
    });
    html += '</ol>';
    listContainer.innerHTML = html;
}

function renderKPICards() {
    let totalSales = 0, cashSales = 0, gcashSales = 0, activeCount = 0;
    orders.forEach(o => {
        if (o.status !== 'Cancelled') {
            totalSales += o.total;
            if (o.payment.includes('GCash')) gcashSales += o.total;
            else cashSales += o.total;
        }
        if (['Received', 'Preparing', 'Ready'].includes(o.status)) activeCount++;
    });

    document.getElementById('kpiTotalSales').innerText = `₱${totalSales.toFixed(2)}`;
    document.getElementById('kpiCashSales').innerText = `₱${cashSales.toFixed(2)}`;
    document.getElementById('kpiGcashSales').innerText = `₱${gcashSales.toFixed(2)}`;
    document.getElementById('kpiActiveOrders').innerText = activeCount;
    document.getElementById('kpiTotalProducts').innerText = products.length;
}

function openEndStoreDayModal() {
    const reportBox = document.getElementById('endDayReportContent');
    let totalSales = 0, cashSales = 0, gcashSales = 0;
    orders.forEach(o => {
        if (o.status !== 'Cancelled') {
            totalSales += o.total;
            if (o.payment.includes('GCash')) gcashSales += o.total;
            else cashSales += o.total;
        }
    });

    reportBox.innerHTML = `
        <p><strong>Total Orders Today:</strong> ${orders.length}</p>
        <p><strong>Total Revenue:</strong> ₱${totalSales.toFixed(2)}</p>
        <p>💵 <strong>Cash:</strong> ₱${cashSales.toFixed(2)}</p>
        <p>📱 <strong>GCash:</strong> ₱${gcashSales.toFixed(2)}</p>
    `;
    openModal('endDayModal');
}

function closeDayAndClearOrders() {
    orderHistory = orders.concat(orderHistory);
    orders = [];
    saveState();
    closeModal('endDayModal');
    renderStaffTables();
    renderTVDisplay();
    renderProducts(products);
    alert("✅ Store day closed and orders archived.");
}

/* --- HISTORY & TRASH --- */
function openOrderHistoryModal() {
    renderOrderHistoryTable();
    openModal('historyModal');
}

function renderOrderHistoryTable() {
    const body = document.getElementById('historyTableBody');
    body.innerHTML = '';
    if (orderHistory.length === 0) {
        body.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#888;">No past order history available.</td></tr>';
        return;
    }

    orderHistory.forEach((o, idx) => {
        const row = document.createElement('tr');
        row.className = 'longpress-row';
        row.innerHTML = `
            <td><strong>${o.id}</strong><br><small style="color:#777;">${o.timestamp}</small></td>
            <td><small>${o.items}</small></td>
            <td>₱${o.total.toFixed(2)}</td>
            <td><span class="status-select status-${o.status}">${o.status}</span></td>
        `;

        let timer;
        const startPress = () => {
            timer = setTimeout(() => {
                if (confirm(`🗑️ Delete Order ${o.id} and move to Trash Bin?`)) {
                    trashHistory.unshift(orderHistory.splice(idx, 1)[0]);
                    saveState();
                    renderOrderHistoryTable();
                }
            }, 800);
        };
        const clearPress = () => clearTimeout(timer);

        row.addEventListener('mousedown', startPress);
        row.addEventListener('mouseup', clearPress);
        row.addEventListener('mouseleave', clearPress);
        row.addEventListener('touchstart', startPress);
        row.addEventListener('touchend', clearPress);

        body.appendChild(row);
    });
}

function filterOrderHistory() {
    const query = document.getElementById('historySearchInput').value.toLowerCase();
    document.querySelectorAll('#historyTableBody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
    });
}

function openTrashModal() {
    closeModal('historyModal');
    isSelectionMode = false;
    selectedTrashIndices = [];
    document.getElementById('trashDotsMenu').classList.remove('show');
    renderTrashTable();
    openModal('trashModal');
}

function toggleDotsDropdown() {
    document.getElementById('trashDotsMenu').classList.toggle('show');
}

window.onclick = function(event) {
    if (!event.target.matches('.icon-btn-header')) {
        const dropdowns = document.getElementsByClassName("dots-dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
}

function emptyTrashDirectly() {
    if (trashHistory.length === 0) {
        alert("Trash bin is already empty.");
        return;
    }
    if (confirm("🚨 Permanently delete all items in Trash Bin?")) {
        trashHistory = [];
        saveState();
        renderTrashTable();
        alert("🗑️ Trash emptied!");
    }
}

function toggleSelectionMode() {
    isSelectionMode = !isSelectionMode;
    document.getElementById('selectModeBtn').innerText = isSelectionMode ? 'Cancel' : 'Select';
    document.getElementById('selectColHeader').style.display = isSelectionMode ? 'table-cell' : 'none';
    document.getElementById('bulkActionBar').style.display = isSelectionMode ? 'flex' : 'none';
    renderTrashTable();
}

function renderTrashTable() {
    const body = document.getElementById('trashTableBody');
    body.innerHTML = '';
    if (trashHistory.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#888;">Trash Bin is empty.</td></tr>';
        return;
    }
    trashHistory.forEach((o, idx) => {
        body.innerHTML += `
            <tr>
                ${isSelectionMode ? `<td style="text-align:center;"><input type="checkbox" onchange="toggleTrashSelect(${idx})"></td>` : ''}
                <td><strong>${o.id}</strong><br><small style="color:#777;">${o.timestamp}</small></td>
                <td><small>${o.items}</small></td>
                <td>₱${o.total.toFixed(2)}</td>
                <td><span class="status-select status-${o.status}">${o.status}</span></td>
            </tr>
        `;
    });
}

function toggleTrashSelect(idx) {
    const pos = selectedTrashIndices.indexOf(idx);
    if (pos === -1) selectedTrashIndices.push(idx);
    else selectedTrashIndices.splice(pos, 1);
}

function restoreSelectedItems() {
    if (selectedTrashIndices.length === 0) {
        orderHistory = trashHistory.concat(orderHistory);
        trashHistory = [];
    } else {
        selectedTrashIndices.sort((a, b) => b - a).forEach(idx => {
            orderHistory.unshift(trashHistory.splice(idx, 1)[0]);
        });
    }
    saveState();
    toggleSelectionMode();
    renderTrashTable();
    alert("✅ Items restored!");
}

function deleteSelectedPermanently() {
    if (confirm("Permanently delete selected items?")) {
        if (selectedTrashIndices.length === 0) trashHistory = [];
        else {
            selectedTrashIndices.sort((a, b) => b - a).forEach(idx => trashHistory.splice(idx, 1));
        }
        saveState();
        toggleSelectionMode();
        renderTrashTable();
        alert("🗑️ Deleted permanently.");
    }
}

function openUserOrderHistory() {
    if (!currentUser) return;
    const body = document.getElementById('userHistoryTableBody');
    body.innerHTML = '';
    const userOrders = orders.concat(orderHistory).filter(o => o.userEmail === currentUser.email);

    if (userOrders.length === 0) {
        body.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#888;">You have no past orders.</td></tr>';
    } else {
        userOrders.forEach(o => {
            body.innerHTML += `
                <tr>
                    <td><strong>${o.id}</strong><br><small style="color:#777;">${o.timestamp}</small></td>
                    <td><small>${o.items}</small></td>
                    <td>₱${o.total.toFixed(2)}</td>
                    <td><span class="status-select status-${o.status}">${o.status}</span></td>
                </tr>
            `;
        });
    }
    openModal('userOrderHistoryModal');
}

function backToOrderHistory() {
    closeModal('trashModal');
    openOrderHistoryModal();
}

// USER TRASH HISTORY STATE
let userTrashHistory = JSON.parse(localStorage.getItem('cnc_user_trash_history')) || [];
let isUserSelectionMode = false;
let selectedUserTrashIndices = [];

function saveState() {
    localStorage.setItem('cnc_products', JSON.stringify(products));
    localStorage.setItem('cnc_custom_options', JSON.stringify(customOptions));
    localStorage.setItem('cnc_orders', JSON.stringify(orders));
    localStorage.setItem('cnc_order_history', JSON.stringify(orderHistory));
    localStorage.setItem('cnc_trash_history', JSON.stringify(trashHistory));
    localStorage.setItem('cnc_user_trash_history', JSON.stringify(userTrashHistory));
    localStorage.setItem('cnc_users', JSON.stringify(registeredUsers));
    localStorage.setItem('cnc_contact_info', JSON.stringify(contactInfo));
    if (currentUser) {
        localStorage.setItem('cnc_current_user', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('cnc_current_user');
    }
}

/* --- USER ORDER HISTORY & TRASH LOGIC --- */
function openUserOrderHistory() {
    if (!currentUser) return;
    renderUserOrderHistoryTable();
    openModal('userOrderHistoryModal');
}

function renderUserOrderHistoryTable() {
    if (!currentUser) return;
    const body = document.getElementById('userHistoryTableBody');
    body.innerHTML = '';

    const userOrders = orders.concat(orderHistory).filter(o => o.userEmail === currentUser.email);

    if (userOrders.length === 0) {
        body.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#888;">You have no past orders.</td></tr>';
        return;
    }

    userOrders.forEach((o) => {
        const row = document.createElement('tr');
        row.className = 'longpress-row';
        row.setAttribute('title', 'Press and hold to delete item');
        row.innerHTML = `
            <td><strong>${o.id}</strong><br><small style="color:#777;">${o.timestamp}</small></td>
            <td><small>${o.items}</small></td>
            <td>₱${o.total.toFixed(2)}</td>
            <td><span class="status-select status-${o.status}">${o.status}</span></td>
        `;

        let timer;
        const startPress = () => {
            timer = setTimeout(() => {
                if (confirm(`🗑️ Delete Order ${o.id} and move to Trash Bin?`)) {
                    // Remove from active orders or orderHistory
                    let activeIdx = orders.findIndex(item => item.id === o.id);
                    if (activeIdx !== -1) {
                        userTrashHistory.unshift(orders.splice(activeIdx, 1)[0]);
                    } else {
                        let histIdx = orderHistory.findIndex(item => item.id === o.id);
                        if (histIdx !== -1) {
                            userTrashHistory.unshift(orderHistory.splice(histIdx, 1)[0]);
                        }
                    }
                    saveState();
                    renderUserOrderHistoryTable();
                }
            }, 800);
        };

        const clearPress = () => clearTimeout(timer);

        row.addEventListener('mousedown', startPress);
        row.addEventListener('mouseup', clearPress);
        row.addEventListener('mouseleave', clearPress);
        row.addEventListener('touchstart', startPress);
        row.addEventListener('touchend', clearPress);

        body.appendChild(row);
    });
}

function filterUserOrderHistory() {
    const query = document.getElementById('userHistorySearchInput').value.toLowerCase();
    document.querySelectorAll('#userHistoryTableBody tr').forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
    });
}

function openUserTrashModal() {
    closeModal('userOrderHistoryModal');
    isUserSelectionMode = false;
    selectedUserTrashIndices = [];
    document.getElementById('userTrashDotsMenu').classList.remove('show');
    renderUserTrashTable();
    openModal('userTrashModal');
}

function backToUserOrderHistory() {
    closeModal('userTrashModal');
    openUserOrderHistory();
}

function toggleUserTrashDotsMenu() {
    document.getElementById('userTrashDotsMenu').classList.toggle('show');
}

function emptyUserTrashDirectly() {
    if (!currentUser) return;
    const currentUsersItems = userTrashHistory.filter(o => o.userEmail === currentUser.email);
    if (currentUsersItems.length === 0) {
        alert("Trash bin is already empty.");
        return;
    }
    if (confirm("🚨 Are you sure you want to permanently delete all items in your Trash Bin?")) {
        userTrashHistory = userTrashHistory.filter(o => o.userEmail !== currentUser.email);
        saveState();
        renderUserTrashTable();
        alert("🗑️ Trash Bin emptied successfully!");
    }
}

function toggleUserSelectionMode() {
    isUserSelectionMode = !isUserSelectionMode;
    document.getElementById('userSelectModeBtn').innerText = isUserSelectionMode ? 'Cancel' : 'Select';
    document.getElementById('userSelectColHeader').style.display = isUserSelectionMode ? 'table-cell' : 'none';
    document.getElementById('userBulkActionBar').style.display = isUserSelectionMode ? 'flex' : 'none';
    renderUserTrashTable();
}

function renderUserTrashTable() {
    if (!currentUser) return;
    const body = document.getElementById('userTrashTableBody');
    body.innerHTML = '';

    const userTrashItems = userTrashHistory.filter(o => o.userEmail === currentUser.email);

    if (userTrashItems.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#888;">Trash Bin is empty.</td></tr>';
        return;
    }

    userTrashItems.forEach((o, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            ${isUserSelectionMode ? `<td style="text-align:center;"><input type="checkbox" style="width:18px; height:18px; cursor:pointer;" onchange="toggleUserTrashSelect(${idx})"></td>` : ''}
            <td><strong>${o.id}</strong><br><small style="color:#777;">${o.timestamp}</small></td>
            <td><small>${o.items}</small></td>
            <td>₱${o.total.toFixed(2)}</td>
            <td><span class="status-select status-${o.status}">${o.status}</span></td>
        `;
        body.appendChild(row);
    });
}

function toggleUserTrashSelect(idx) {
    const pos = selectedUserTrashIndices.indexOf(idx);
    if (pos === -1) selectedUserTrashIndices.push(idx);
    else selectedUserTrashIndices.splice(pos, 1);
}

function restoreUserSelectedItems() {
    if (!currentUser) return;
    const userTrashItems = userTrashHistory.filter(o => o.userEmail === currentUser.email);

    if (selectedUserTrashIndices.length === 0) {
        // Restore All
        userTrashItems.forEach(item => {
            orderHistory.unshift(item);
        });
        userTrashHistory = userTrashHistory.filter(o => o.userEmail !== currentUser.email);
    } else {
        selectedUserTrashIndices.sort((a, b) => b - a).forEach(idx => {
            const itemToRestore = userTrashItems[idx];
            if (itemToRestore) {
                orderHistory.unshift(itemToRestore);
                const globalIdx = userTrashHistory.findIndex(o => o.id === itemToRestore.id);
                if (globalIdx !== -1) userTrashHistory.splice(globalIdx, 1);
            }
        });
    }

    saveState();
    toggleUserSelectionMode();
    renderUserTrashTable();
    alert("✅ Selected items restored to Order History!");
}

function deleteUserSelectedPermanently() {
    if (!currentUser) return;
    if (confirm("Are you sure you want to permanently delete these items?")) {
        const userTrashItems = userTrashHistory.filter(o => o.userEmail === currentUser.email);

        if (selectedUserTrashIndices.length === 0) {
            userTrashHistory = userTrashHistory.filter(o => o.userEmail !== currentUser.email);
        } else {
            selectedUserTrashIndices.sort((a, b) => b - a).forEach(idx => {
                const itemToDelete = userTrashItems[idx];
                if (itemToDelete) {
                    const globalIdx = userTrashHistory.findIndex(o => o.id === itemToDelete.id);
                    if (globalIdx !== -1) userTrashHistory.splice(globalIdx, 1);
                }
            });
        }

        saveState();
        toggleUserSelectionMode();
        renderUserTrashTable();
        alert("🗑️ Items permanently deleted.");
    }
}

// Global state para sa napiling tab sa TV display
let currentTVTab = 'Received';

function switchTVTab(statusName) {
    currentTVTab = statusName;

    // I-update ang kulay at active state ng mga buttons sa itaas
    const tabs = [
        { name: 'Received', id: 'btnTabReceived', color: '#3a86ff' },
        { name: 'Preparing', id: 'btnTabPreparing', color: '#f4a261' },
        { name: 'Ready for Courier Pick-Up', id: 'btnTabReady', color: '#2a9d8f' },
        { name: 'Handed To Delivery Rider', id: 'btnTabHanded', color: '#006064' },
        { name: 'Completed', id: 'btnTabCompleted', color: '#9d4edd' }
    ];

    tabs.forEach(t => {
        const btn = document.getElementById(t.id);
        if (btn) {
            if (t.name === statusName) {
                btn.style.background = t.color;
                btn.style.color = 'white';
            } else {
                btn.style.background = '#333348';
                btn.style.color = '#aaa';
            }
        }
    });

    renderTVDisplay();
}

/* --- TV DISPLAY BOARD NA MAY BUTTONS AT RIDER DETAILS --- */
let currentReviewingOrderId = null;

function renderTVDisplay() {
    const displayContainer = document.getElementById('tvTabOrderDisplay');
    const titleContainer = document.getElementById('tvTabTitle');
    if (!displayContainer || !titleContainer) return;

    titleContainer.innerText = `Status: ${currentTVTab}`;
    displayContainer.innerHTML = '';

    let displayOrders = orders;
    if (currentUser && currentUser.role !== 'staff') {
        displayOrders = orders.filter(o => o.userEmail === currentUser.email);
    } else if (!currentUser) {
        displayContainer.innerHTML = `<p style="color: #aaa; font-style: italic;">Please sign in to view your order status.</p>`;
        return;
    }

    const filteredOrders = displayOrders.filter(o => o.status === currentTVTab);

    if (filteredOrders.length === 0) {
        displayContainer.innerHTML = `<p style="color: #aaa; font-style: italic;">No orders found under "${currentTVTab}".</p>`;
        return;
    }

    filteredOrders.forEach(o => {
    let extraRiderDetails = '';
        if (o.status === 'Handed To Delivery Rider' && o.riderName) {
        extraRiderDetails = `
            <div style="background: #1e1e2f; border: 1px dashed #00b4d8; padding: 0.8rem 1.2rem; border-radius: 8px; font-size: 0.85rem; text-align: left; max-width: 320px; width: 100%;">
                <p style="color: #00b4d8; font-weight: bold; margin-bottom: 0.3rem;">🛵 Assigned Delivery Rider</p>
                <p><b>Name:</b> ${o.riderName}</p>
                <p><b>Contact No:</b> ${o.riderContact}</p>
            </div>
        `;
    }

        // Kung ang tab ay Completed at customer ang naka-login, lagyan ng Review button sa gilid ng Order ID
        let reviewBtnHtml = '';
        if (currentTVTab === 'Completed' && currentUser && currentUser.role !== 'staff' && o.userEmail === currentUser.email) {
            reviewBtnHtml = `
                <button class="form-btn" style="margin-top: 0.5rem; padding: 0.3rem 0.8rem; font-size: 0.75rem; background: var(--primary-color); width: auto;" onclick="openProductReviewPage('${o.id}')">
                    ⭐ Review Products
                </button>
            `;
        }

        displayContainer.innerHTML += `
            <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap; background: #333348; padding: 1.2rem 2rem; border-radius: 10px; width: 100%; max-width: 550px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                <div style="text-align: center;">
                    <div style="font-size: 0.75rem; color: #aaa; text-transform: uppercase;">Order ID Number</div>
                    <div style="font-size: 1.8rem; font-weight: bold; color: #f4a261;">${o.id}</div>
                    ${reviewBtnHtml}
                </div>
                ${extraRiderDetails}
            </div>
        `;
    });
}

function openProductReviewPage(orderId) {
    const allOrders = orders.concat(orderHistory);
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    currentReviewingOrderId = order.id;
    document.getElementById('reviewPageTitle').innerText = `⭐ Review Products for Order ${order.id}`;
    
    const container = document.getElementById('productReviewListContainer');
    container.innerHTML = '';

    // Kunin ang mga items sa order (gamit ang rawItemsList o i-parse ang items)
    let itemsToReview = order.rawItemsList || [{ name: order.items, qty: 1 }];

    itemsToReview.forEach((item, idx) => {
        const existingReview = (order.productReviews && order.productReviews[item.name]) || { rating: 5, comment: '' };
        
        container.innerHTML += `
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 0.8rem; border: 1px solid #ddd; color: #333;">
                <h4 style="margin-bottom: 0.3rem; color: var(--primary-color);">${item.qty}x ${item.name}</h4>
                <div style="margin-bottom: 0.5rem;">
                    <label style="font-size: 0.8rem; font-weight: bold;">Rating:</label>
                    <select id="prodRating_${idx}" class="status-select" style="width: 100px;">
                        <option value="5" ${existingReview.rating == 5 ? 'selected' : ''}>⭐⭐⭐⭐⭐ (5)</option>
                        <option value="4" ${existingReview.rating == 4 ? 'selected' : ''}>⭐⭐⭐⭐ (4)</option>
                        <option value="3" ${existingReview.rating == 3 ? 'selected' : ''}>⭐⭐⭐ (3)</option>
                        <option value="2" ${existingReview.rating == 2 ? 'selected' : ''}>⭐⭐ (2)</option>
                        <option value="1" ${existingReview.rating == 1 ? 'selected' : ''}>⭐ (1)</option>
                    </select>
                </div>
                <div>
                    <label style="font-size: 0.8rem; font-weight: bold;">Comment / Feedback:</label>
                    <input type="text" id="prodComment_${idx}" value="${existingReview.comment || ''}" placeholder="Kamusta ang lasa ng produktong ito?" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.85rem;">
                </div>
                <input type="hidden" id="prodName_${idx}" value="${item.name}">
            </div>
        `;
    });

    openModal('productReviewPageModal');
}

function saveProductReviews() {
    const allOrders = orders.concat(orderHistory);
    const order = allOrders.find(o => o.id === currentReviewingOrderId);
    if (!order) return;

    if (!order.productReviews) order.productReviews = {};

    let itemsToReview = order.rawItemsList || [{ name: order.items, qty: 1 }];

    itemsToReview.forEach((item, idx) => {
        const rating = document.getElementById(`prodRating_${idx}`).value;
        const comment = document.getElementById(`prodComment_${idx}`).value.trim();
        const prodName = document.getElementById(`prodName_${idx}`).value;

        order.productReviews[prodName] = { rating: parseInt(rating), comment };
    });

    saveState();
    closeModal('productReviewPageModal');
    alert("⭐ Na-save na ang iyong mga product reviews! Maraming salamat.");
    renderTVDisplay();
}

/* --- EVENT LISTENERS --- */
function setupEventListeners() {
    cartBtn.addEventListener('click', () => {
        cartDrawer.classList.add('open');
        overlay.classList.add('active');
    });

    closeCart.addEventListener('click', closeAllDrawersAndModals);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;

            if (activeCategory === 'all') renderProducts(products);
            else renderProducts(products.filter(p => p.category === activeCategory));
        });
    });

    searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        renderProducts(products.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)));
    });
}

window.onload = init;

function playDingSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Bell sound: Gumagamit tayo ng dalawang oscillators para sa richer harmonic bell tone
        const now = audioCtx.currentTime;

        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Pangunahing frequency ng bell (mataas na pitch para sa parang counter bell)
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1318.51, now); // E6 note

        // Pangalawang frequency para sa metal ring effect
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(2637.02, now); // E7 note

        // Volume Envelope (Mabilis na hataw sa simula tapos unti-unting hihina/mag-a-fade out nang matagal)
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start(now);
        osc2.start(now);

        osc1.stop(now + 1.5);
        osc2.stop(now + 1.5);
    } catch (e) {
        console.log("Audio not supported or blocked by browser", e);
    }
}

function togglePasswordVisibility(fieldId, btnElement) {
    const inputField = document.getElementById(fieldId);
    if (!inputField) return;

    if (inputField.type === "password") {
        inputField.type = "text";
        btnElement.innerText = "👁️‍🗨️"; // Pwede mong palitan ng ibang icon o panatilihin
    } else {
        inputField.type = "password";
        btnElement.innerText = "👁️";
    }
}

// FUNCTION PARA I-RESET ANG LAHAT NG PASSWORD TOGGLE EYES PABALIK SA DEFAULT (HIDDEN)
function resetAllPasswordToggles() {
    const passwordInputs = document.querySelectorAll('.password-input-wrapper input');
    passwordInputs.forEach(input => {
        input.type = 'password';
    });

    const toggleBtns = document.querySelectorAll('.toggle-password-btn');
    toggleBtns.forEach(btn => {
        btn.innerText = '👁️';
    });
}

// FUNCTION PARA IPAKITA ANG LAHAT NG REVIEWS SA REVIEWS PAGE
function renderAllCustomerReviewsPage() {
    const container = document.getElementById('allCustomerReviewsList');
    if (!container) return;
    container.innerHTML = '';

    const allOrders = orders.concat(orderHistory);
    let totalReviewsCount = 0;

    allOrders.forEach(order => {
        if (order.productReviews && Object.keys(order.productReviews).length > 0) {
            for (let prodName in order.productReviews) {
                const rev = order.productReviews[prodName];
                totalReviewsCount++;

                let stars = '⭐'.repeat(rev.rating || 5);

                container.innerHTML += `
                    <div style="background: white; padding: 1.2rem; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border-left: 5px solid var(--primary-color);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
                            <h4 style="color: var(--primary-color); font-size: 1.05rem;">🥐 ${prodName}</h4>
                            <span style="font-size: 0.8rem; color: #888;">Order ID: <b>${order.id}</b> | ${order.timestamp}</span>
                        </div>
                        <div style="margin-bottom: 0.4rem;">
                            <span style="font-size: 1.1rem;">${stars}</span>
                            <span style="font-weight: bold; font-size: 0.85rem; color: #555; margin-left: 0.5rem;">by ${order.custName || 'Valued Customer'}</span>
                        </div>
                        <p style="font-size: 0.95rem; color: #333; font-style: italic; background: #fdf8f3; padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px dashed #f0d0b0; margin-top: 0.4rem;">
                            "${rev.comment || 'No comment written.'}"
                        </p>
                    </div>
                `;
            }
        }
    });

    if (totalReviewsCount === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #888; background: white; border-radius: 10px;">Wala pang reviews na naipopost ang mga customers. Mag-order at maging kauna-unahang mag-review!</div>`;
    }
}

// INUPDATE NA saveProductReviews PARA KUSA PUMUNTA SA REVIEWS PAGE PAGKATAPOS MAG-REVIEW
function saveProductReviews() {
    const allOrders = orders.concat(orderHistory);
    const order = allOrders.find(o => o.id === currentReviewingOrderId);
    if (!order) return;

    if (!order.productReviews) order.productReviews = {};

    let itemsToReview = order.rawItemsList || [{ name: order.items, qty: 1 }];

    itemsToReview.forEach((item, idx) => {
        const rating = document.getElementById(`prodRating_${idx}`).value;
        const comment = document.getElementById(`prodComment_${idx}`).value.trim();
        const prodName = document.getElementById(`prodName_${idx}`).value;

        order.productReviews[prodName] = { rating: parseInt(rating), comment };
    });

    saveState();
    closeModal('productReviewPageModal');
    alert("⭐ Na-save na ang iyong mga product reviews! Maraming salamat.");
    
    // Didiretso na ito sa Customer Reviews Page para makita ang kanyang review at ng iba
    switchView('reviews');
}

// Awtomatikong mag-a-auto logout kapag pinindot ang back button ng browser
window.addEventListener('popstate', function(event) {
    if (currentUser) {
        currentUser = null;
        saveState();
        renderAuthHeaderUI();
        renderHamburgerMenu();
        switchView('customer');
    }
});

// Magdagdag ng history state tuwing mag-i-init o magre-login para ma-monitor ang pag-back
history.pushState(null, null, window.location.href);
window.addEventListener('popstate', function () {
    history.pushState(null, null, window.location.href);
});
                                                                                                                        
