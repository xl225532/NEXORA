/* =========================================================
NEXORA - APP.JS
البرمجة العامة للموقع
========================================================= */

"use strict";

/* =========================================================
CONFIG
========================================================= */

const NEXORA_CONFIG = {
appName: "NEXORA",
loginPage: "login.html",
registerPage: "register.html",
dashboardPage: "dashboard.html"
};

/* =========================================================
STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
currentUser: "nexora_current_user"
};

/* =========================================================
GENERAL HELPERS
========================================================= */

function getCurrentUser() {
try {
const data = localStorage.getItem(
STORAGE_KEYS.currentUser
);

    if (!data) {
        return null;
    }

    return JSON.parse(data);

} catch (error) {

    console.error(
        "NEXORA: Error reading current user",
        error
    );

    return null;
}

}

function setCurrentUser(user) {

try {

    localStorage.setItem(
        STORAGE_KEYS.currentUser,
        JSON.stringify(user)
    );

} catch (error) {

    console.error(
        "NEXORA: Error saving current user",
        error
    );

}

}

function clearCurrentUser() {

localStorage.removeItem(
    STORAGE_KEYS.currentUser
);

}

function redirectTo(page) {

window.location.href = page;

}

/* =========================================================
AUTH CHECK
========================================================= */

function checkUserLogin() {

const user = getCurrentUser();

const currentPage =
    window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();


/*
   إذا كان المستخدم داخل لوحة التحكم
   ولا يوجد مستخدم مسجل الدخول
   نعيده إلى صفحة تسجيل الدخول
*/

if (
    currentPage ===
    NEXORA_CONFIG.dashboardPage
    &&
    !user
) {

    redirectTo(
        NEXORA_CONFIG.loginPage
    );

    return;

}


/*
   إذا كان المستخدم مسجل الدخول
   وحاول فتح تسجيل الدخول أو التسجيل
   يمكننا توجيهه إلى لوحة التحكم
*/

if (
    user
    &&
    (
        currentPage === "login.html"
        ||
        currentPage === "register.html"
    )
) {

    redirectTo(
        NEXORA_CONFIG.dashboardPage
    );

}

}

/* =========================================================
LOGOUT
========================================================= */

function logout() {

const confirmLogout =
    window.confirm(
        "هل تريد تسجيل الخروج من حسابك؟"
    );


if (!confirmLogout) {

    return;

}


clearCurrentUser();


redirectTo(
    NEXORA_CONFIG.loginPage
);

}

/* =========================================================
DASHBOARD USER DATA
========================================================= */

function loadDashboardUser() {

const user =
    getCurrentUser();


if (!user) {

    return;

}


/*
   اسم المستخدم
*/

const userNameElements =
    document.querySelectorAll(
        "[data-user-name]"
    );


userNameElements.forEach(
    element => {

        element.textContent =
            user.name || "مستخدم";

    }
);


/*
   البريد أو رقم الهاتف
*/

const identifierElements =
    document.querySelectorAll(
        "[data-user-identifier]"
    );


identifierElements.forEach(
    element => {

        element.textContent =
            user.identifier || "";

    }
);


/*
   الرصيد
*/

const balanceElements =
    document.querySelectorAll(
        "[data-user-balance]"
    );


balanceElements.forEach(
    element => {

        const balance =
            Number(
                user.balance || 0
            );


        element.textContent =
            balance.toFixed(2);

    }
);


/*
   كود الدعوة
*/

const referralElements =
    document.querySelectorAll(
        "[data-referral-code]"
    );


referralElements.forEach(
    element => {

        element.textContent =
            user.referralCode || "---";

    }
);


/*
   الحرف الأول من اسم المستخدم
   ليظهر داخل Avatar
*/

const avatarElements =
    document.querySelectorAll(
        "[data-user-avatar]"
    );


avatarElements.forEach(
    element => {

        const name =
            user.name || "NEXORA";


        element.textContent =
            name
            .charAt(0)
            .toUpperCase();

    }
);

}

/* =========================================================
DASHBOARD NAVIGATION
========================================================= */

function setupDashboardNavigation() {

const navItems =
    document.querySelectorAll(
        "[data-page]"
    );


const pages =
    document.querySelectorAll(
        "[data-dashboard-page]"
    );


if (
    navItems.length === 0
    ||
    pages.length === 0
) {

    return;

}


navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            function () {

                const targetPage =
                    this.getAttribute(
                        "data-page"
                    );


                if (!targetPage) {

                    return;

                }


                /*
                   إزالة الحالة النشطة
                   من جميع أزرار القائمة
                */

                navItems.forEach(
                    navItem => {

                        navItem.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                   إضافة الحالة النشطة
                   للزر الحالي
                */

                this.classList.add(
                    "active"
                );


                /*
                   إخفاء جميع الصفحات
                */

                pages.forEach(
                    page => {

                        page.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                   إظهار الصفحة المطلوبة
                */

                const target =
                    document.querySelector(
                        `[data-dashboard-page="${targetPage}"]`
                    );


                if (target) {

                    target.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);

}

/* =========================================================
COPY REFERRAL CODE
========================================================= */

function setupReferralCopy() {

const copyButtons =
    document.querySelectorAll(
        "[data-copy-referral]"
    );


copyButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            async function () {

                const user =
                    getCurrentUser();


                if (
                    !user
                    ||
                    !user.referralCode
                ) {

                    return;

                }


                try {

                    await navigator.clipboard.writeText(
                        user.referralCode
                    );


                    const oldText =
                        this.textContent;


                    this.textContent =
                        "تم النسخ ✓";


                    setTimeout(
                        () => {

                            this.textContent =
                                oldText;

                        },
                        1500
                    );


                } catch (error) {

                    console.error(
                        "NEXORA: Copy failed",
                        error
                    );

                }

            }
        );

    }
);

}

/* =========================================================
MOBILE MENU
========================================================= */

function setupMobileMenu() {

const menuButton =
    document.querySelector(
        "[data-menu-toggle]"
    );


const sidebar =
    document.querySelector(
        "[data-sidebar]"
    );


if (
    !menuButton
    ||
    !sidebar
) {

    return;

}


menuButton.addEventListener(
    "click",
    function () {

        sidebar.classList.toggle(
            "open"
        );

    }
);

}

/* =========================================================
CURRENT YEAR
========================================================= */

function setCurrentYear() {

const yearElements =
    document.querySelectorAll(
        "[data-current-year]"
    );


const currentYear =
    new Date().getFullYear();


yearElements.forEach(
    element => {

        element.textContent =
            currentYear;

    }
);

}

/* =========================================================
APP INITIALIZATION
========================================================= */

function initializeNexora() {

/*
   فحص حالة تسجيل الدخول
*/

checkUserLogin();


/*
   تحميل بيانات المستخدم
*/

loadDashboardUser();


/*
   تشغيل التنقل
*/

setupDashboardNavigation();


/*
   تشغيل نسخ كود الدعوة
*/

setupReferralCopy();


/*
   تشغيل القائمة في الهاتف
*/

setupMobileMenu();


/*
   تحديث السنة
*/

setCurrentYear();

}

/* =========================================================
START NEXORA
========================================================= */

document.addEventListener(
"DOMContentLoaded",
function () {

    initializeNexora();

}

);
