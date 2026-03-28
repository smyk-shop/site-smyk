const products = [
    { id: 1, name: "пися", price: 100, img: "" },
    { id: 2, name: "", price: 100, img: "" },
    { id: 3, name: "", price: 100, img: "" },
    { id: 4, name: "", price: 100, img: "" },
    { id: 5, name: "", price: 100, img: "" },
    { id: 6, name: "", price: 100, img: "" },
    { id: 7, name: "", price: 100, img: "" },
    { id: 8, name: "", price: 100, img: "" },
    { id: 9, name: "", price: 100, img: "" },
    { id: 10, name: "", price: 100, img: "" },
    { id: 11, name: "", price: 100, img: "" },
    { id: 12, name: "", price: 100, img: "" },
    { id: 13, name: "", price: 100, img: "" },
];

// 2. ИНИЦИАЛИЗАЦИЯ КОРЗИНЫ
let cart = JSON.parse(localStorage.getItem('myCart')) || [];

// 3. ФУНКЦИЯ СКЕЛЕТОНОВ (Прелоадер)
function showSkeletons() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        grid.innerHTML += `
            <div class="card is-loading">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-price"></div>
            </div>`;
    }
}

// 4. ГЛАВНАЯ ФУНКЦИЯ ОТРИСОВКИ ТОВАРОВ
window.renderProducts = function(filter = "") {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(filter.toLowerCase())
    );
    
    grid.innerHTML = filtered.length ? '' : '<p style="grid-column: 1/-1; text-align: center; padding: 50px;">Ничего не найдено 🔍</p>';

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">${p.price.toLocaleString()} ₽</p>
            <button class="btn-add" onclick="addToCart(${p.id})">В корзину</button>
        `;
        grid.appendChild(card);
    });
}

// 5. ЛОГИКА КОРЗИНЫ
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartUI();
        saveCart();
        
        // Показываем стильное уведомление
        showToast(`✅ ${product.name} добавлен!`);
        
        // Анимация иконки корзины
        const icon = document.querySelector('.cart-icon');
        icon.style.transform = "scale(1.4) rotate(-10deg)";
        setTimeout(() => icon.style.transform = "scale(1) rotate(0deg)", 250);
    }
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
    saveCart();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('total-price');

    if (countEl) countEl.innerText = cart.length;
    
    if (list) {
        list.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.name}</span>
                <span>${item.price.toLocaleString()} ₽ 
                <button onclick="removeFromCart(${index})" style="color:#ff3b30; border:none; background:none; cursor:pointer; font-weight:bold; margin-left:10px">✕</button></span>
            `;
            list.appendChild(div);
        });
        if (totalEl) totalEl.innerText = total.toLocaleString();
    }
}

function saveCart() {
    localStorage.setItem('myCart', JSON.stringify(cart));
}

// 6. ОФОРМЛЕНИЕ ЗАКАЗА
const BOT_TOKEN = CONFIG.TELEGRAM_BOT_TOKEN;
const CHAT_ID = CONFIG.TELEGRAM_CHAT_ID;

window.checkout = function() {
    // 1. Проверка корзины
    if (cart.length === 0) {
        showToast('❌ Корзина пуста!');
        return;
    }

    // 2. Сбор данных
    const name = document.getElementById('user-name').value.trim();
    const phone = document.getElementById('user-phone').value.trim();
    const address = document.getElementById('user-address').value.trim();
    const time = document.getElementById('user-time').value.trim();

    // 3. Валидация (Проверка)
    if (!name || !phone || !address || !time) {
        showToast('⚠️ Заполните все поля!');
        return;
    }

    // Простая проверка телефона (минимум 10 цифр)
    const phoneDigits = phone.replace(/\D/g, ""); // оставляем только цифры
    if (phoneDigits.length < 10) {
        showToast('📞 Введите корректный номер!');
        return;
    }

    // 4. Формирование сообщения для Telegram
    let message = `<b>🔔 НОВЫЙ ЗАКАЗ</b>\n\n`;
    message += `<b>👤 Клиент:</b> ${name}\n`;
    message += `<b>📞 Тел:</b> ${phone}\n`;
    message += `<b>📍 Адрес:</b> ${address}\n`;
    message += `<b>⏰ Время:</b> ${time}\n\n`;
    message += `<b>🛒 Товары:</b>\n`;

    let total = 0;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} — ${item.price.toLocaleString()} ₽\n`;
        total += item.price;
    });
    message += `\n<b>💰 ИТОГО: ${total.toLocaleString()} ₽</b>`;

     const url = `https://api.telegram.org{BOT_TOKEN}/sendMessage`;
    
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            parse_mode: 'html',
            text: message
        })
    })
    .then(response => {
        if (response.ok) {
            showToast('🚀 Заказ успешно отправлен!');
            // Очистка после успеха
            cart = [];
            saveCart();
            updateCartUI();
            document.getElementById('cart-modal').style.display = 'none';
            document.querySelectorAll('.order-form input').forEach(i => i.value = '');
        } else {
            showToast('❌ Ошибка API Telegram');
        }
    })
    .catch(error => {
        console.error(error);
        showToast('🌐 Ошибка сети (нужен VPN)');
    });
}

// 7. ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
document.addEventListener('DOMContentLoaded', () => {
    // Элементы управления
    const modal = document.getElementById('cart-modal');
    const cartBtn = document.querySelector('.cart-icon');
    const closeBtn = document.querySelector('.close-modal');
    const searchInput = document.querySelector('.search-bar input');

    // Модальное окно
    if (cartBtn) cartBtn.onclick = () => modal.style.display = 'block';
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; }

    // Живой поиск
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderProducts(e.target.value);
        });
    }

    // Имитация загрузки сервера через скелетоны
    showSkeletons();
    setTimeout(() => {
        renderProducts();
        updateCartUI();
    }, 1200);
    
});
window.showToast = function(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    
    container.appendChild(toast);
    
    // Плавное появление
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Удаление через 3 секунды
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}